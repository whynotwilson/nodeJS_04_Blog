const Post = require('../lib/mongo').Post

module.exports = {
  // 創建一篇文章
  create: function create (post) {
    return Post.create(post).exec()
  }
}
