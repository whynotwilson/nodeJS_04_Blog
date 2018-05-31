const path = require('path') //
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')(__dirname)
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')
const app = express()

//  設置模版目錄
app.set('views', path.join(__dirname, 'views'))

//  設置模版引擎為 ejs
app.set('view engine', 'ejs')

//  設置靜態文件目錄
app.set(express.static(path.join(__dirname, 'public')))

//  session 中間件
app.use(session({
  name: config.session.key, //  設置 cookie 中保存session id 的字段名稱
  secret: config.session.secret, //  通過設置 secret 來計算 hash 值並放在cookie中，使產生的signedCookie防竄改
  resave: true, //  強制更新 session
  saveUninitialized: false, //  設置為 false, 強置創建一個session,即使用戶未登錄
  cookie: {
    maxAge: config.session.maxAge //  過期時間,過期後cookie中的session id自動刪除
  },
  store: new MongoStore({
    //  url : 'mongoldb://localhost:27017/myblog'
    url: config.mongodb //  mongodb地址
  })
}))

//  flash中間件,用來顯示通知
// app.use(flash()) 暫時還不能用，待解決**

//  路由
routes(app)

//  監聽端口，啟動程序
app.listen(config.port, function () {
  console.log(`$  { pkg.name } listening on port $  { config.port }`)
})

//  中間件的加載順序很重要。
//  如上面設置靜態文件目錄的中間件應該放到routes(app) 之前加載，
//  這樣靜態文件的請求就不會落到業務邏輯的路由里；
//  flash 中間件應該放到 session中間件之後
//  因為flash 是基於session 實現的。
