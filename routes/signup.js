const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 註冊頁
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

// POST /signup 用戶註冊
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  const avatar = req.files.avatar.path.split(path.sep).pop()
  let password = req.fields.password
  const repassword = req.fields.repassword

  // 參數檢查
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字請限制在1-10個字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性別只能是 m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('各人簡介請限制在 1-30 個字符')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少頭像')
    }
    if (password.length < 6) {
      throw new Error('密碼至少 6 個字')
    }
    if (password !== repassword) {
      throw new Error('兩次輸入密碼不一致')
    }
  } catch (e) {
    // 註冊失敗，異步刪除上傳的頭像
    fs.unlink(req.files.avatar.path)
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  // 密碼加密
  password = sha1(password)

  // 待寫入數據庫的用戶資料
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  }

  // 將用戶資料寫入資料庫
  UserModel.create(user)
    .then(function (result) {
      // 此 user 是插入 mongodb 後的值，包含 _id
      user = result.ops[0]
      // 刪除密碼這種敏感資料，將用戶資料存入 session
      delete user.password
      req.session.user = user

      // 寫入 flash
      req.flash('success', '註冊成功')

      // 跳轉到首頁
      res.redirect('/posts')
    })
    .catch(function (e) {
      // 註冊失敗，異步刪除上傳的頭像
      fs.unlink(req.files.avatar.path)

      // 用戶名重覆，跳回註冊頁，而不是錯誤頁
      if (e.message.match('duplicate key')) {
        req.flash('error', '用戶名重複')
        return res.redirect('/signup')
      }

      next(e)
    })
})

module.exports = router
