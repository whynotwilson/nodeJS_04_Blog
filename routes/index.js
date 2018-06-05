module.exports = function (app) {
  app.get('/', function (req, res) {
    console.log('routes index test')
    res.send('root')
    // res.redirect('/posts')
  })
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
}
