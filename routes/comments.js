const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const CommentModel = require('../models/comments')

// POST /comments 新增一條留言
router.post('/', checkLogin, function (req, res, next) {
  const author = req.session.user._id
  const postId = req.fields.postId
  const content = req.fields.content

  // 檢查參數
  try {
    if (!content.length) {
      throw new Error('請填寫留言內容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  const comment = {
    author: author,
    postId: postId,
    content: content
  }

  CommentModel.create(comment)
    .then(function () {
      req.flash('success', '留言成功')
      // 留言成功後跳轉到上一頁
      res.redirect('back')
    })
    .catch(next)
})

// GET /comments/:commentId/remove 刪除一條留言
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
  const commentId = req.params.commentId
  const author = req.session.user._id

  CommentModel.getCommentById(commentId)
    .then(function (comment) {
      if (!comment) {
        throw new Error('留言不存在')
      }
      if (comment.author.toString() !== author.toString()) {
        throw new Error('沒有權限刪除留言')
      }
      CommentModel.delCommentById(commentId)
        .then(function () {
          req.flash('success', '刪除留言成功')
          // 刪除成功後跳轉到上一頁
          req.redirect('back')
        })
        .catch(next)
    })
})

module.exports = router
