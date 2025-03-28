const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema(
  {
    contractNumber: {
      type: String,
      required: [true, '请输入合同编号'],
      unique: true,
      trim: true,
    },
    contractName: {
      type: String,
      required: [true, '请输入合同名称'],
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, '请选择客户'],
    },
    contractType: {
      type: String,
      required: [true, '请选择合同类型'],
      enum: ['代理购电', '直接交易', '长协', '现货'],
    },
    contractStatus: {
      type: String,
      enum: ['草稿', '审批中', '已生效', '已到期', '已终止'],
      default: '草稿',
    },
    startDate: {
      type: Date,
      required: [true, '请输入合同开始日期'],
    },
    endDate: {
      type: Date,
      required: [true, '请输入合同结束日期'],
    },
    contractAmount: {
      type: Number, // 合同电量，单位: kWh
      required: [true, '请输入合同电量'],
    },
    priceModel: {
      type: String,
      enum: ['固定电价', '浮动电价', '阶梯电价', '分时电价'],
      required: [true, '请选择计价模式'],
    },
    basePrice: {
      type: Number, // 单位: 元/kWh
      required: [true, '请输入基础电价'],
    },
    peakPrice: {
      type: Number, // 单位: 元/kWh
    },
    valleyPrice: {
      type: Number, // 单位: 元/kWh
    },
    flatPrice: {
      type: Number, // 单位: 元/kWh
    },
    discountRate: {
      type: Number, // 折扣率
      min: 0,
      max: 1,
    },
    monthlyLimits: [
      {
        month: Number,
        limitAmount: Number, // 月度电量限制
      },
    ],
    paymentTerms: {
      billingCycle: {
        type: String,
        enum: ['月度', '季度', '年度'],
        default: '月度',
      },
      paymentDays: {
        type: Number,
        default: 15, // 账单生成后的付款天数
      },
      paymentMethod: {
        type: String,
        enum: ['银行转账', '支票', '现金', '电子支付'],
        default: '银行转账',
      },
    },
    deviationTolerance: {
      type: Number, // 允许的偏差范围，百分比
      default: 0.1,
    },
    deviationPenalty: {
      type: Number, // 偏差惩罚系数
      default: 1.2,
    },
    specialTerms: {
      type: String,
    },
    approvalProcess: [
      {
        stage: String,
        approver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['待审批', '已通过', '已拒绝'],
        },
        comments: String,
        timestamp: Date,
      },
    ],
    attachments: [
      {
        name: String,
        type: String,
        url: String,
        uploadDate: Date,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tradingStrategy: {
      riskLevel: {
        type: String,
        enum: ['低风险', '中等风险', '高风险'],
        default: '中等风险',
      },
      marketExposure: {
        longTerm: Number, // 长期合约占比
        spot: Number, // 现货占比
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 虚拟字段: 关联的账单
ContractSchema.virtual('bills', {
  ref: 'Bill',
  localField: '_id',
  foreignField: 'contract',
  justOne: false,
});

// 创建合同编号索引
ContractSchema.index({ contractNumber: 1 });

// 创建客户+合同状态的复合索引
ContractSchema.index({ customer: 1, contractStatus: 1 });

module.exports = mongoose.model('Contract', ContractSchema); 