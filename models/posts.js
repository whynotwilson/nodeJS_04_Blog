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
  delPostById: function delPostById (postId) {
    return Post.deleteOne({_id: postId}).exec()
  }
}
