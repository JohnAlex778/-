const Customer = require('../models/Customer');

// @desc    获取所有客户
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res) => {
  try {
    // 构建查询条件
    let query = {};
    
    // 根据查询参数过滤
    if (req.query.customerType) {
      query.customerType = req.query.customerType;
    }
    
    if (req.query.customerCategory) {
      query.customerCategory = req.query.customerCategory;
    }
    
    if (req.query.customerLevel) {
      query.customerLevel = req.query.customerLevel;
    }
    
    if (req.query.contractStatus) {
      query.contractStatus = req.query.contractStatus;
    }

    if (req.query.keyword) {
      query.$or = [
        { customerName: { $regex: req.query.keyword, $options: 'i' } },
        { contactPerson: { $regex: req.query.keyword, $options: 'i' } },
        { contactPhone: { $regex: req.query.keyword, $options: 'i' } },
        { contactEmail: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // 分页
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // 执行查询
    const customers = await Customer.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // 获取总记录数
    const total = await Customer.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: customers.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: customers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    获取单个客户
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('contracts');
    
    if (!customer) {
      return res.status(404).json({ success: false, message: '未找到该客户' });
    }
    
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    创建客户
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res) => {
  try {
    // 设置默认值和修改后的值
    req.body.assignedManager = req.body.assignedManager || req.user.id;
    
    const customer = await Customer.create(req.body);
    
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    
    // 处理验证错误
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    更新客户
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ success: false, message: '未找到该客户' });
    }
    
    // 更新客户信息
    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    
    // 处理验证错误
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    删除客户
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ success: false, message: '未找到该客户' });
    }
    
    await customer.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};

// @desc    获取客户统计信息
// @route   GET /api/customers/stats
// @access  Private
exports.getCustomerStats = async (req, res) => {
  try {
    // 客户分类统计
    const categoryCounts = await Customer.aggregate([
      {
        $group: {
          _id: '$customerCategory',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // 客户等级统计
    const levelCounts = await Customer.aggregate([
      {
        $group: {
          _id: '$customerLevel',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // 合同状态统计
    const contractStatusCounts = await Customer.aggregate([
      {
        $group: {
          _id: '$contractStatus',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // 本月新增客户数
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const newCustomersCount = await Customer.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });
    
    // 即将到期的合同客户数
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    
    const expiringContractsCount = await Customer.countDocuments({
      'customerLifecycle.renewalDate': {
        $gte: now,
        $lte: thirtyDaysLater
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        categoryCounts,
        levelCounts,
        contractStatusCounts,
        newCustomersCount,
        expiringContractsCount,
        totalCustomers: await Customer.countDocuments()
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
};