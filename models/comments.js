const marked = require('marked')
const Comment = require('../lib/mongo').Comment

// 將 comment 的 content 從 markdown 轉換成 html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  // 創建一個留言
  create: function create (comment) {
    return Comment.create(comment).exec()
  },

  // 通過留言 id 獲取一個留言
  getCommentById: function getCommentById (commentId) {
    return Comment.findOne({_id: commentId}).exec()
  },

  // 通過留言 id 刪除一個留言
  delCommentById: function(commentId) {
    return Comment.deleteOne({_id: commentId}).exec()
  },

  // 通過文章 id 刪除該文章底下所有留言
  delCommentsByPostId: function delCommentsByPostId (postId) {
    return Comment.deleteMany({postId: postId}).exec()
  },

  // 通過文章 id 獲取該文章底下所有留言，按留言創建時間升序
  getComments: function getComments (postId) {
    return Comment
      .find({postId: postId})
      .populate({path: 'author', model: 'User'})
      .sort({_id: 1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 通過文章 id 獲取該文章下留言數
  getCommentsCount: function(postId) {
    return Comment.count({postId: postId}).exec()
  }
}
