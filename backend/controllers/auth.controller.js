const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: '该邮箱已被注册' });
    }

    // 创建用户
    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
    });

    // 生成Token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证邮箱和密码
    if (!email || !password) {
      return res.status(400).json({ success: false, message: '请提供邮箱和密码' });
    }

    // 检查用户是否存在
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: '无效的登录信息' });
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '无效的登录信息' });
    }

    // 生成Token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    获取当前登录用户
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    修改密码
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 获取用户
    const user = await User.findById(req.user.id).select('+password');

    // 验证当前密码
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '当前密码不正确' });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    // 生成新Token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      message: '密码修改成功',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    忘记密码
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: '该邮箱未注册' });
    }

    // 生成重置密码令牌（在实际应用中，这里会发送重置密码邮件）
    // 此处简化处理，直接返回成功信息
    res.status(200).json({
      success: true,
      message: '密码重置指令已发送到您的邮箱',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    退出登录
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // 在客户端，需要清除localStorage中的token
    res.status(200).json({
      success: true,
      message: '成功退出登录',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
}; 