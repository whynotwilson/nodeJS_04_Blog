const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

//POST /comments 新增一條留言
router.post('/' , checkLogin, function(req, res, next){
  res.send('新增留言');
});

//GET /comments/:commentId/remove 刪除一條留言
router.get('/:commentId/remove', checkLogin, function(req, res, next){
  res.send('刪除留言');
});

module.exports = router;
