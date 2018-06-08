const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require('../models/posts')

// GET /posts 所有用戶或者特定用戶的文章頁
// eg: GET /posts?author=???
router.get('/', function (req, res, next) {
  const author = req.query.author

  PostModel.getPosts(author)
    .then(function (posts) {
      res.render('posts', {
        posts: posts
      })
    })
    .catch(next)
})

// POST /posts/create 發表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.files.content

  // 檢查參數
  try {
    if (!title.length) {
      throw new Error('請填寫標題')
    }
    if (!content.length) {
      throw new Error('請填寫內容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let post = {
    author: author,
    title: title,
    content: content
  }

  PostModel.create(post)
    .then(function (result) {
      // 此 post 是插入 mongodb 後的值，包含_id
      post = result.ops[0]
      req.flash('success', '發表成功')
      // 發表成功後跳轉到該文章頁
      res.redirect(`/posts/${post._id}`)
    })
    .catch(next)
})

// GET /posts/create 發表文章頁
router.get('create', checkLogin, function (req, res, next) {
  res.render('create')
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
