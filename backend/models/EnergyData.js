const mongoose = require('mongoose');

const EnergyDataSchema = new mongoose.Schema(
  {
    dataPointId: {
      type: String,
      required: [true, '请输入数据点ID'],
      unique: true,
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, '请选择客户'],
    },
    meterNumber: {
      type: String,
      required: [true, '请输入电表编号'],
      trim: true,
    },
    meterType: {
      type: String,
      enum: ['智能电表', '传统电表', '多功能电表', '负荷控制表'],
      required: [true, '请选择电表类型'],
    },
    dataType: {
      type: String,
      enum: ['用电量', '需量', '功率因数', '电压', '电流', '频率', '有功功率', '无功功率'],
      required: [true, '请选择数据类型'],
    },
    timestamp: {
      type: Date,
      required: [true, '请输入时间戳'],
      index: true,
    },
    value: {
      type: Number,
      required: [true, '请输入数值'],
    },
    unit: {
      type: String,
      required: [true, '请输入单位'],
      enum: ['kWh', 'kW', 'PF', 'V', 'A', 'Hz'],
    },
    quality: {
      type: String,
      enum: ['正常', '估计值', '异常', '缺失'],
      default: '正常',
    },
    location: {
      province: String,
      city: String,
      address: String,
      coordinates: {
        longitude: Number,
        latitude: Number,
      },
    },
    sourceSystem: {
      type: String,
    },
    readingType: {
      type: String,
      enum: ['自动抄表', '人工抄表', '远程抄表'],
      default: '远程抄表',
    },
    periodType: {
      type: String,
      enum: ['实时', '15分钟', '30分钟', '小时', '日', '月'],
      required: true,
    },
    tariffPeriod: {
      type: String,
      enum: ['峰时', '平时', '谷时', '尖峰'],
    },
    verificationStatus: {
      type: String,
      enum: ['未验证', '已验证', '有疑问'],
      default: '未验证',
    },
    tags: [String],
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// 创建复合索引来优化查询性能
EnergyDataSchema.index({ customer: 1, timestamp: -1 });
EnergyDataSchema.index({ meterNumber: 1, timestamp: -1 });
EnergyDataSchema.index({ dataType: 1, timestamp: -1 });
EnergyDataSchema.index({ periodType: 1, timestamp: -1 });

// 创建负荷汇总方法
EnergyDataSchema.statics.getLoadProfile = async function (
  customerId,
  startDate,
  endDate,
  periodType = '小时'
) {
  const aggregationPipeline = [
    {
      $match: {
        customer: mongoose.Types.ObjectId(customerId),
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        dataType: '用电量',
        periodType: periodType,
      },
    },
    {
      $group: {
        _id: {
          // 根据periodType决定如何分组
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          hour: periodType === '小时' ? { $hour: '$timestamp' } : null,
        },
        totalConsumption: { $sum: '$value' },
        avgConsumption: { $avg: '$value' },
        maxConsumption: { $max: '$value' },
        readingCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.day': 1,
        '_id.hour': 1,
      },
    },
  ];

  return this.aggregate(aggregationPipeline);
};

module.exports = mongoose.model('EnergyData', EnergyDataSchema); 