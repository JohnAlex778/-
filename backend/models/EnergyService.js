const mongoose = require('mongoose');

const EnergyServiceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: [true, '请输入服务ID'],
      unique: true,
      trim: true,
    },
    serviceName: {
      type: String,
      required: [true, '请输入服务名称'],
      trim: true,
    },
    serviceType: {
      type: String,
      enum: [
        '分布式能源管理',
        '光伏发电服务',
        '储能服务',
        '充电桩服务',
        '绿证交易',
        '碳资产管理',
        '电力运维',
        '用能优化',
        '能效管理',
        '需求响应',
        '其他服务'
      ],
      required: [true, '请选择服务类型'],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, '请选择客户'],
    },
    serviceStatus: {
      type: String,
      enum: ['规划中', '实施中', '运行中', '已暂停', '已终止', '已完成'],
      default: '规划中',
    },
    servicePeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    serviceDescription: {
      type: String,
      required: [true, '请输入服务描述'],
    },
    serviceLocation: {
      province: String,
      city: String,
      district: String,
      address: String,
      coordinates: {
        longitude: Number,
        latitude: Number,
      },
    },
    contractInfo: {
      contractNumber: String,
      contractType: String,
      contractValue: Number,
      paymentTerms: String,
    },
    technicalSpecs: {
      installedCapacity: Number, // 安装容量，单位kW
      annualOutput: Number, // 年发电量，单位kWh
      equipmentType: String,
      manufacturer: String,
      efficiency: Number, // 效率，百分比
    },
    financialMetrics: {
      investmentCost: Number, // 投资金额
      annualRevenue: Number, // 年收益
      paybackPeriod: Number, // 回收期，单位年
      IRR: Number, // 内部收益率
      NPV: Number, // 净现值
    },
    environmentalBenefits: {
      carbonReduction: Number, // 碳减排量，吨
      greenCertificates: Number, // 绿证数量
      energySavings: Number, // 节能量，kWh
    },
    serviceComponents: [
      {
        componentName: String,
        componentType: String,
        description: String,
        status: String,
      },
    ],
    milestones: [
      {
        milestoneName: String,
        plannedDate: Date,
        actualDate: Date,
        status: {
          type: String,
          enum: ['待开始', '进行中', '已完成', '已延期', '已取消'],
        },
        description: String,
      },
    ],
    operationalData: {
      availabilityRate: Number, // 可用率，百分比
      performanceRatio: Number, // 性能比
      faultRate: Number, // 故障率
      maintenanceRecords: [
        {
          date: Date,
          description: String,
          technician: String,
          cost: Number,
        },
      ],
    },
    projectTeam: [
      {
        role: String,
        name: String,
        contactInfo: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    riskAssessment: {
      overallRisk: String,
      riskFactors: [
        {
          factor: String,
          level: String,
          mitigationMeasure: String,
        },
      ],
    },
    attachments: [
      {
        name: String,
        type: String,
        url: String,
        uploadDate: Date,
      },
    ],
    relatedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EnergyService',
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

// 创建索引
EnergyServiceSchema.index({ serviceId: 1 });
EnergyServiceSchema.index({ customer: 1, serviceType: 1 });
EnergyServiceSchema.index({ serviceStatus: 1 });
EnergyServiceSchema.index({ 'servicePeriod.endDate': 1 }); // 用于查找即将到期的服务

// 虚拟字段：服务剩余天数
EnergyServiceSchema.virtual('remainingDays').get(function () {
  const today = new Date();
  const endDate = new Date(this.servicePeriod.endDate);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// 虚拟字段：服务完成百分比
EnergyServiceSchema.virtual('completionPercentage').get(function () {
  const startDate = new Date(this.servicePeriod.startDate);
  const endDate = new Date(this.servicePeriod.endDate);
  const today = new Date();
  
  // 如果还未开始
  if (today < startDate) return 0;
  
  // 如果已经结束
  if (today > endDate) return 100;
  
  // 计算进行中的百分比
  const totalDuration = endDate - startDate;
  const elapsedDuration = today - startDate;
  return Math.round((elapsedDuration / totalDuration) * 100);
});

// 计算服务效益
EnergyServiceSchema.methods.calculateROI = function() {
  if (!this.financialMetrics.investmentCost || !this.financialMetrics.annualRevenue) {
    return 0;
  }
  
  // 简单ROI计算: (年收益 / 投资成本) * 100%
  return (this.financialMetrics.annualRevenue / this.financialMetrics.investmentCost) * 100;
};

module.exports = mongoose.model('EnergyService', EnergyServiceSchema); 