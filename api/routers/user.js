const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

//注册
router.post('/signup',UserController.user_signup);
//登录
router.post('/login',UserController.user_login);

module.exports = router;