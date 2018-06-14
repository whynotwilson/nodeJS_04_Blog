const path = require('path')
const assert = require('assert')
const request = require('supertest')
const app = request('../index')
const User = require('../lib/mongo').User

const testName1 = 'testName1'
const testName2 = 'nswbmw'
describe('signup', function () {
  describe('POST /signup', function () {
    const agent = request.agent(app)// persist cookie when redirect
    beforeEach(function (done) {
      // 創建一個用戶
      User.create({
        name: testName1,
        password: '123456',
        avatar: '',
        gender: 'x',
        bio: ''
      })
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
    })

    afterEach(function (done) {
      // 刪除測試用戶
      User.deleteMane({name: {$in: [testName1, testName2]}})
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
    })

    after(function (done) {
      process.exit()
    })

    // 用戶名錯誤的情況
    it('wrong name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: ''})
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/名字請限制在 1-10 個字符/))
          done()
        })
    })

    // 性別錯誤的情況
    it('wrong gender', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: testName2, gender: 'a'})
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/性別只能是 m、f 或 x/))
          done()
        })
    })

    // 用戶名被佔用的情況
    it('duplicate name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: testName1, gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/用戶名已被佔用/))
          done()
        })
    })

    // 註冊成功的情況
    it('success', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: testName2, gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/註冊成功/))
          done()
        })
    })
  })
})
