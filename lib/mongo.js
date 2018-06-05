const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

// 儲存用戶的用戶名、密碼(加密後)、頭像、性別、個人簡介
exports.Users = mongolass.model('User', {
  name: {type: 'string', required: true},
  password: {type: 'string', required: true},
  avatar: {type: 'string', required: true},
  gender: {type: 'string', enum: ['m', 'f', 'x'], default: 'x'},
  bio: {type: 'string', required: true}
})

// 根據用戶名找到用戶，帳號不可重複，全局唯一
exports.Users.index({name: 1}, {unique: true}).exec()
