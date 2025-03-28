const mongoose = require('mongoose');

const RiskAssessmentSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: [true, '请输入风险评估ID'],
      unique: true,
      trim: true,
    },
    assessmentName: {
      type: String,
      required: [true, '请输入风险评估名称'],
      trim: true,
    },
    assessmentType: {
      type: String,
      enum: ['客户信用风险', '市场价格风险', '交易量风险', '监管合规风险', '结算风险', '综合风险'],
      required: [true, '请选择风险评估类型'],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
    },
    tradingPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TradingPlan',
    },
    assessmentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    validityPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    riskLevel: {
      type: String,
      enum: ['低风险', '中低风险', '中等风险', '中高风险', '高风险'],
      required: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    creditRisk: {
      score: Number,
      level: String,
      factors: [
        {
          factor: String,
          score: Number,
          weight: Number,
          impact: String,
        },
      ],
      analysis: String,
    },
    marketRisk: {
      score: Number,
      level: String,
      factors: [
        {
          factor: String,
          score: Number,
          weight: Number,
          impact: String,
        },
      ],
      analysis: String,
      marketVolatility: Number,
      priceRisk: Number,
    },
    volumeRisk: {
      score: Number,
      level: String,
      factors: [
        {
          factor: String,
          score: Number,
          weight: Number,
          impact: String,
        },
      ],
      analysis: String,
      deviationProbability: Number,
      loadUncertainty: Number,
    },
    regulatoryRisk: {
      score: Number,
      level: String,
      factors: [
        {
          factor: String,
          score: Number,
          weight: Number,
          impact: String,
        },
      ],
      analysis: String,
      complianceStatus: String,
    },
    riskMitigationMeasures: [
      {
        measure: String,
        targetRisk: String,
        responsibleParty: String,
        status: {
          type: String,
          enum: ['计划中', '进行中', '已完成', '已取消'],
        },
        expectedImpact: String,
        deadline: Date,
      },
    ],
    riskTrend: {
      type: String,
      enum: ['上升', '稳定', '下降'],
      default: '稳定',
    },
    exposureAmount: {
      type: Number, // 风险敞口金额
    },
    confidenceInterval: {
      lower: Number,
      upper: Number,
      confidenceLevel: Number,
    },
    scenarios: [
      {
        scenarioName: String,
        probability: Number,
        impact: String,
        description: String,
        potentialLoss: Number,
      },
    ],
    riskLimits: {
      maxExposure: Number,
      stopLoss: Number,
      thresholds: {
        warning: Number,
        alert: Number,
        critical: Number,
      },
    },
    approvalInfo: {
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      approvalDate: Date,
      comments: String,
    },
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

// 创建复合索引
RiskAssessmentSchema.index({ assessmentId: 1 });
RiskAssessmentSchema.index({ customer: 1, assessmentType: 1 });
RiskAssessmentSchema.index({ riskLevel: 1, assessmentDate: -1 });
RiskAssessmentSchema.index({ 'validityPeriod.endDate': 1 }); // 用于查找即将到期的风险评估

// 创建一个计算综合风险分数的方法
RiskAssessmentSchema.methods.calculateOverallRiskScore = function() {
  const weights = {
    creditRisk: 0.3,
    marketRisk: 0.25,
    volumeRisk: 0.25,
    regulatoryRisk: 0.2
  };
  
  let overallScore = 0;
  let scoreCount = 0;
  
  if (this.creditRisk && this.creditRisk.score) {
    overallScore += this.creditRisk.score * weights.creditRisk;
    scoreCount++;
  }
  
  if (this.marketRisk && this.marketRisk.score) {
    overallScore += this.marketRisk.score * weights.marketRisk;
    scoreCount++;
  }
  
  if (this.volumeRisk && this.volumeRisk.score) {
    overallScore += this.volumeRisk.score * weights.volumeRisk;
    scoreCount++;
  }
  
  if (this.regulatoryRisk && this.regulatoryRisk.score) {
    overallScore += this.regulatoryRisk.score * weights.regulatoryRisk;
    scoreCount++;
  }
  
  // 如果没有任何风险分数，返回默认值
  if (scoreCount === 0) {
    return 50; // 默认中等风险
  }
  
  // 调整权重计算
  return overallScore / (weights.creditRisk + weights.marketRisk + weights.volumeRisk + weights.regulatoryRisk);
};

// 保存前自动计算风险等级
RiskAssessmentSchema.pre('save', function(next) {
  // 如果没有明确设置风险分数，则计算
  if (!this.riskScore) {
    this.riskScore = this.calculateOverallRiskScore();
  }
  
  // 根据分数确定风险等级
  if (this.riskScore <= 20) {
    this.riskLevel = '低风险';
  } else if (this.riskScore <= 40) {
    this.riskLevel = '中低风险';
  } else if (this.riskScore <= 60) {
    this.riskLevel = '中等风险';
  } else if (this.riskScore <= 80) {
    this.riskLevel = '中高风险';
  } else {
    this.riskLevel = '高风险';
  }
  
  next();
});

module.exports = mongoose.model('RiskAssessment', RiskAssessmentSchema); 