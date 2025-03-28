import React from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Statistic, Radio } from 'antd';
import { CloudDownloadOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const EnergyDataDashboard: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Select
            placeholder="选择客户"
            style={{ width: '100%' }}
            defaultValue="all"
          >
            <Option value="all">所有客户</Option>
            <Option value="1">国家电网有限公司</Option>
            <Option value="2">某制造集团有限公司</Option>
            <Option value="3">某科技有限公司</Option>
            <Option value="4">某商业广场</Option>
          </Select>
        </Col>
        <Col span={8}>
          <RangePicker style={{ width: '100%' }} />
        </Col>
        <Col span={4}>
          <Button type="primary" icon={<ReloadOutlined />}>刷新数据</Button>
        </Col>
        <Col span={4}>
          <Button icon={<CloudDownloadOutlined />}>导出数据</Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用电量"
              value={187526}
              suffix="kWh"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最大需量"
              value={423.5}
              suffix="kW"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均负荷率"
              value={65.8}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="峰谷差率"
              value={43.2}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card 
            title="负荷曲线" 
            extra={
              <Radio.Group defaultValue="day">
                <Radio.Button value="day">日</Radio.Button>
                <Radio.Button value="week">周</Radio.Button>
                <Radio.Button value="month">月</Radio.Button>
              </Radio.Group>
            }
          >
            <div style={{ height: 300, background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              此处需要接入真实负荷曲线图表
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="分时段用电量占比">
            <div style={{ height: 300, background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              此处需要接入饼图
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="用电量趋势分析">
            <div style={{ height: 300, background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              此处需要接入趋势图
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="用电分析建议">
            <p><strong>负荷特征分析：</strong>您的用电负荷呈现典型的工作日高峰、夜间和周末低谷的特征。工作日9:00-11:00和14:00-16:00为用电高峰期。</p>
            <p><strong>用电效率建议：</strong>建议在用电高峰期控制用电需求，将部分可转移负荷安排在谷时段运行，可有效降低电费成本。</p>
            <p><strong>节能潜力分析：</strong>根据历史数据分析，若采取建议的用电优化措施，预计每月可节约电费约15%，减少用电量约8%。</p>
            <p><strong>需求响应机会：</strong>您的用电模式适合参与电网需求响应项目，高峰时段具有约20%的负荷可调节能力，建议考虑参与相关项目以获取额外收益。</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EnergyDataDashboard; 