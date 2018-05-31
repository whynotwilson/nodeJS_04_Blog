const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用戶或者特定用戶的文章頁
// eg: GET /posts?author=???
router.get('/', function (req, res, next) {
  res.send('主頁')
})

// POST /posts/create 發表一篇文章
router.post('/create', function (req, res, next) {
  res.send('發表文章')
})

// GET /posts/create 發表文章頁
router.get('create', function (req, res, next) {
  res.send('發表文章頁')
})

// GET /posts/:postId 單獨一篇的文章頁
router.get('/:postId', function (req, res, next) {
  res.send('文章詳情頁')
})

// GET /posts/:postId/edit 編輯文章頁
router.get('/posts/:postId/edit', function (req, res, next) {
  res.send('編輯文章頁')
})

// GET /posts/:postId/remove 刪除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('刪除文章')
})

module.exports = router
