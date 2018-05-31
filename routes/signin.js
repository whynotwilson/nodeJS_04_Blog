const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkNotLogin

// GET  /signin 登錄頁
router.get('/', function (req, res, next) {
  res.send('登錄頁')
})

// POST /signin 用戶登錄
router.post('/signin', checkLogin, function (req, res, next) {
  res.send('登錄')
})

module.exports = router
