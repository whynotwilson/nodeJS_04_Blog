const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkNotLogin

// GET /signup 註冊頁
router.get('/', checkLogin, function (req, res, next) {
  res.send('註冊頁')
})

// POST /signup 用戶註冊
router.post('/', checkLogin, function (req, res, next) {
  res.send('用戶註冊')
})

module.exports = router
