module.exports = {
  checkLogin : function checkLogin (req, res, next){
    if( !req.session.user ){
      req.flash('error', '未登錄');
      return res.redirect('signin');
    }
    next();
  },

  checkNotLogin : function checkNotLogin(req, res, next){
    if( req.session.user ){
      req.flach('error', '已登錄');
      return res.redirect('back');//返回之前的頁面
    }
    next();
  }
}
