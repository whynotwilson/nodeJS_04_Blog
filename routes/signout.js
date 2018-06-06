const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
  // 清空 session 中用戶信息
  req.session.user = null
  req.flash('succecc', '登出成功')
  // 登出成功後跳轉到主頁
  res.redirect('/posts')
})

module.exports = router
