const User = require('../lib/mongo').User

module.exports = {
  // 註冊一個用戶
  create: function create (user) {
    return User.create(user).exec()
  },

  // 通過用戶名獲取用戶信息
  getUserByName: function getUserByName (name) {
    return User
      .findOne({ name: name })
      .addCreatedAt()
      .exec()
  }
}
