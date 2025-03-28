const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, '请输入客户名称'],
      trim: true,
    },
    customerType: {
      type: String,
      required: [true, '请选择客户类型'],
      enum: ['企业客户', '个人客户'],
    },
    customerCategory: {
      type: String,
      required: [true, '请选择客户分类'],
      enum: ['大客户', '中小企业', '居民用户'],
    },
    customerLevel: {
      type: String,
      enum: ['A级', 'B级', 'C级', 'D级'],
      default: 'C级',
    },
    contactPerson: {
      type: String,
      required: function() {
        return this.customerType === '企业客户';
      },
    },
    contactPhone: {
      type: String,
      required: [true, '请输入联系电话'],
    },
    contactEmail: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        '请输入有效的邮箱地址',
      ],
    },
    address: {
      province: String,
      city: String,
      district: String,
      street: String,
      postcode: String,
    },
    businessLicense: {
      type: String,
      required: function() {
        return this.customerType === '企业客户';
      },
    },
    creditCode: {
      type: String,
      required: function() {
        return this.customerType === '企业客户';
      },
    },
    industry: {
      type: String,
    },
    annualElectricity: {
      type: Number, // 单位: kWh
    },
    peakDemand: {
      type: Number, // 单位: kW
    },
    contractStatus: {
      type: String,
      enum: ['潜在客户', '已签约', '合同到期', '已终止'],
      default: '潜在客户',
    },
    customerLifecycle: {
      acquisitionDate: Date,
      signDate: Date,
      renewalDate: Date,
      terminationDate: Date,
    },
    creditScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 60,
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    paymentTerms: {
      type: String,
      enum: ['预付费', '月结', '季度结算', '年度结算'],
      default: '月结',
    },
    customerProfile: {
      loadCharacteristics: {
        dailyLoadCurve: [Number], // 24小时负荷曲线
        seasonalPattern: String,
        peakHours: [String],
      },
      electricityBehavior: {
        sensitivityToPrice: String,
        flexibilityPotential: Number,
        demandResponseCapability: Boolean,
      },
    },
    assignedManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [String],
    notes: String,
    // 关联文档
    relatedDocuments: [
      {
        name: String,
        type: String,
        url: String,
        uploadDate: Date,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 虚拟字段: 关联的合同
CustomerSchema.virtual('contracts', {
  ref: 'Contract',
  localField: '_id',
  foreignField: 'customer',
  justOne: false,
});

module.exports = mongoose.model('Customer', CustomerSchema); 