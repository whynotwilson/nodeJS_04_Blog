const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

// 儲存用戶的用戶名、密碼(加密後)、頭像、性別、個人簡介
exports.User = mongolass.model('User', {
  name: {type: 'string', required: true},
  password: {type: 'string', required: true},
  avatar: {type: 'string', required: true},
  gender: {type: 'string', enum: ['m', 'f', 'x'], default: 'x'},
  bio: {type: 'string', required: true}
})

// 根據用戶名找到用戶，帳號不可重複，全局唯一
exports.User.index({name: 1}, {unique: true}).exec()

const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

// 根據 id 生成創建時間 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})

exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Type.ObjectId, require: true },
  title: { type: 'string', require: true },
  content: { type: 'string', require: true },
  pv: {type: 'number', default: 0}
})

// 按創建時間降序查看用戶的文章列表
exports.Post.index({ author: 1, _id: -1 }).exec()
