const marked = require('marked')
const Post = require('../lib/mongo').Post

Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})

module.exports = {
  // 創建一篇文章
  create: function create (post) {
    return Post.create(post).exec()
  },

  // 通過文章 id 獲取一篇文章
  getPostById: function getPostById (postId) {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },

  // 按創建時間降序獲取所有用戶文章或者某個特定用戶的所有文章
  getPosts: function getPosts (author) {
    const query = {}
    if (author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },

  // 通過文章 id 給  pv 加1
  incPv: function incPv (postId) {
    return Post
      .update({_id: postId}, {$inc: { pv: 1 }})
      .exec()
  },

  // 通過文章 id 獲取一篇原生文章(編輯文章)
  getRawPostById: function getRawPostById (postId) {
    return Post
      .findOne({ _id: postId })
      .populate({path: 'author', model: 'User'})
      .exec()
  },

  // 通過文章 id 更新一篇文章
  updatePostById: function updatePostById (postId, data) {
    return Post.update({_id: postId}, {$set: data}).exec()
  },

  // 通過文章 id 刪除一篇文章
  delPostById: function delPostById (postId, author) {
    return Post.deleteOne({author: author, _id: postId})
      .exec()
      .then(function (res) {
        // 文章刪除後，再刪除該文章下所有留言
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsByPostId(postId)
        }
      })
  }
}

const CommentModel = require('./comments')

// 給 post 添加留言數 commentsCount
Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
        post.commentsCount = commentsCount
        return post
      })
    }))
  },

  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(function (count) {
        post.commentsCount = count
        return post
      })
    }
    return post
  }
})
