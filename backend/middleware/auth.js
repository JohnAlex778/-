const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保护路由
exports.protect = async (req, res, next) => {
  let token;

  // 检查请求头中的Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // 从Authorization头中获取token
    token = req.headers.authorization.split(' ')[1];
  }

  // 检查token是否存在
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '没有访问权限',
    });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 检查用户是否存在
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '找不到该用户',
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '没有访问权限',
    });
  }
};

// 授权角色
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `角色 ${req.user.role} 不具备访问权限`,
      });
    }
    next();
  };
}; 