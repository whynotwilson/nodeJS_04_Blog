const User = require('../lib/mongo').User

module.exports = {
  // 註冊一個用戶
  create: function create (user) {
    return User.create(user).exec()
  }
}
