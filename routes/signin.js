const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET  /signin 登錄頁
router.get('/', function (req, res, next) {
  res.render('signin')
})

// POST /signin 用戶登錄
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name
  const password = req.fields.password

  // 檢查參數
  try {
    if (!name.length) {
      throw new Error('請填寫用戶名')
    }
    if (!password.length) {
      throw new Error('請填寫密碼')
    }
  } catch (e) {
    req.flash('errer', e.message)
    return res.redirect('back')
  }

  UserModel.getUserByName(name)
    .then(function (user) {
      if (!user) {
        req.flash('error', '用戶不存在')
        return res.redirect('back')
      }
      // 檢查密碼是否匹配
      if (sha1(password) !== user.password) {
        req.flach('error', '用戶名或密碼錯誤')
        return res.redirect('back')
      }
      req.flash('success', '登入成功')

      // 用戶信息寫入 session
      delete user.password
      req.session.user = user

      //跳轉到主頁
      res.redirect('/posts')
    })
    .catch(next)
})

module.exports = router
