const mongoose = require('mongoose');

const TradingPlanSchema = new mongoose.Schema(
  {
    planNumber: {
      type: String,
      required: [true, '请输入交易计划编号'],
      unique: true,
      trim: true,
    },
    planName: {
      type: String,
      required: [true, '请输入交易计划名称'],
      trim: true,
    },
    planType: {
      type: String,
      enum: ['年度计划', '月度计划', '周计划', '日前计划', '日内计划'],
      required: [true, '请选择计划类型'],
    },
    tradingType: {
      type: String,
      enum: ['中长期交易', '现货交易', '辅助服务', '绿证交易'],
      required: [true, '请选择交易类型'],
    },
    status: {
      type: String,
      enum: ['草稿', '待审批', '已批准', '已执行', '已取消', '已完成'],
      default: '草稿',
    },
    planPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    totalElectricity: {
      type: Number, // 总电量，单位: kWh
      required: true,
    },
    hourlyDistribution: [
      {
        hour: Number, // 0-23
        amount: Number, // kWh
        price: Number, // 元/kWh
      },
    ],
    dailyDistribution: [
      {
        date: Date,
        amount: Number, // kWh
        price: Number, // 元/kWh
      },
    ],
    monthlyDistribution: [
      {
        month: Number, // 1-12
        amount: Number, // kWh
        price: Number, // 元/kWh
      },
    ],
    averagePrice: {
      type: Number, // 平均价格，单位: 元/kWh
      required: true,
    },
    totalCost: {
      type: Number, // 总成本，单位: 元
      required: true,
    },
    // 关联的客户清单
    customerAllocations: [
      {
        customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Customer',
        },
        contract: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Contract',
        },
        allocatedAmount: Number, // 分配电量
        allocatedPercentage: Number, // 分配比例
      },
    ],
    marketInfo: {
      marketType: String,
      tradingPlatform: String,
      marketRules: String,
      clearingPrice: Number,
      clearingVolume: Number,
    },
    riskAssessment: {
      priceRisk: {
        level: {
          type: String,
          enum: ['低', '中', '高'],
        },
        description: String,
      },
      volumeRisk: {
        level: {
          type: String,
          enum: ['低', '中', '高'],
        },
        description: String,
      },
      counterpartyRisk: {
        level: {
          type: String,
          enum: ['低', '中', '高'],
        },
        description: String,
      },
      overallRisk: {
        level: {
          type: String,
          enum: ['低', '中', '高'],
        },
        description: String,
      },
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
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// 创建交易计划编号索引
TradingPlanSchema.index({ planNumber: 1 });

// 创建计划类型+状态的复合索引
TradingPlanSchema.index({ planType: 1, status: 1 });

// 创建计划周期索引
TradingPlanSchema.index({ 'planPeriod.startDate': 1, 'planPeriod.endDate': 1 });

module.exports = mongoose.model('TradingPlan', TradingPlanSchema); 