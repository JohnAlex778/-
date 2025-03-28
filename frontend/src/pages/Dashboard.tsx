import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>业务概览</h2>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="当前客户数"
              value={267}
              prefix={<UserOutlined />}
              suffix="户"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="有效合同数"
              value={152}
              prefix={<FileTextOutlined />}
              suffix="份"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月累计售电量"
              value={15.68}
              prefix={<ThunderboltOutlined />}
              suffix="万kWh"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月累计售电金额"
              value={562.35}
              prefix={<DollarCircleOutlined />}
              suffix="万元"
            />
          </Card>
        </Col>
      </Row>
      
      <div style={{ marginTop: 20 }}>
        <Card title="系统简介">
          <p>
            售电公司业务中台系统是为售电公司打造的全方位业务解决方案，涵盖客户管理、合同计费、
            市场交易、能源数据分析、风险控制、增值服务、财务结算和运营管理等核心业务模块。
          </p>
          <p>
            通过本系统，您可以轻松管理客户关系、创建和跟踪合同、进行电力交易规划、分析用电数据、
            评估和控制风险、提供增值服务、管理财务结算以及优化运营流程。
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 