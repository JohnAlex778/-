const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      required: [true, '请输入账单编号'],
      unique: true,
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, '请选择客户'],
    },
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: [true, '请选择关联合同'],
    },
    billType: {
      type: String,
      enum: ['售电账单', '购电账单', '服务费账单', '调整账单'],
      required: [true, '请选择账单类型'],
    },
    billStatus: {
      type: String,
      enum: ['待支付', '部分支付', '已结清', '已逾期', '已取消'],
      default: '待支付',
    },
    billDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    billingPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    electricityAmount: {
      type: Number, // 电量，单位: kWh
      required: true,
    },
    peakElectricity: {
      type: Number, // 峰时电量
    },
    valleyElectricity: {
      type: Number, // 谷时电量
    },
    flatElectricity: {
      type: Number, // 平时电量
    },
    basePrice: {
      type: Number, // 基础电价，单位: 元/kWh
      required: true,
    },
    totalAmount: {
      type: Number, // 账单总金额，单位: 元
      required: true,
    },
    deviationAmount: {
      type: Number, // 偏差电量
    },
    deviationPenalty: {
      type: Number, // 偏差考核费
    },
    additionalFees: [
      {
        feeName: String,
        feeAmount: Number,
        feeDescription: String,
      },
    ],
    discount: {
      type: Number, // 折扣金额
      default: 0,
    },
    tax: {
      type: Number, // 税额
      default: 0,
    },
    payableAmount: {
      type: Number, // 应付金额（含税）
      required: true,
    },
    paidAmount: {
      type: Number, // 已付金额
      default: 0,
    },
    balanceDue: {
      type: Number, // 未付余额
    },
    payment: [
      {
        paymentDate: Date,
        paymentAmount: Number,
        paymentMethod: String,
        transactionId: String,
        remarks: String,
      },
    ],
    invoice: {
      invoiceStatus: {
        type: String,
        enum: ['未开票', '已开票', '已作废'],
        default: '未开票',
      },
      invoiceNumber: String,
      invoiceDate: Date,
      invoiceAmount: Number,
    },
    attachments: [
      {
        name: String,
        type: String,
        url: String,
        uploadDate: Date,
      },
    ],
    remarks: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// 创建账单编号索引
BillSchema.index({ billNumber: 1 });

// 创建客户+账单状态的复合索引
BillSchema.index({ customer: 1, billStatus: 1 });

// 创建账单日期索引
BillSchema.index({ billDate: -1 });

// 创建到期日索引
BillSchema.index({ dueDate: 1 });

// 预计算账单余额
BillSchema.pre('save', function (next) {
  this.balanceDue = this.payableAmount - this.paidAmount;
  next();
});

module.exports = mongoose.model('Bill', BillSchema); 