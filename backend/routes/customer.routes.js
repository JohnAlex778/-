const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats
} = require('../controllers/customer.controller');

const { protect, authorize } = require('../middleware/auth');

// 统计路由
router.get('/stats', protect, getCustomerStats);

// 客户管理路由
router
  .route('/')
  .get(protect, getCustomers)
  .post(protect, createCustomer);

router
  .route('/:id')
  .get(protect, getCustomer)
  .put(protect, updateCustomer)
  .delete(protect, authorize('admin', 'customer-service'), deleteCustomer);

module.exports = router; 