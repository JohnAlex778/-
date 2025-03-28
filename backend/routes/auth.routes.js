const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
  forgotPassword,
  logout
} = require('../controllers/auth.controller');

// 中间件（将在下一步创建）
const { protect } = require('../middleware/auth');

// 注册和登录路由
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);

// 需要认证的路由
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router; 