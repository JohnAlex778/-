import React, { useState } from 'react';
import { Table, Card, Button, Input, Row, Col, Select, Tag, Space, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

// 模拟数据
const mockCustomers = [
  {
    id: '1',
    customerName: '国家电网有限公司',
    customerType: '企业客户',
    customerCategory: '大客户',
    customerLevel: 'A级',
    contactPerson: '张三',
    contactPhone: '13800138000',
    contractStatus: '已签约',
    annualElectricity: 12500000,
    creditScore: 95,
  },
  {
    id: '2',
    customerName: '某制造集团有限公司',
    customerType: '企业客户',
    customerCategory: '中小企业',
    customerLevel: 'B级',
    contactPerson: '李四',
    contactPhone: '13900139000',
    contractStatus: '已签约',
    annualElectricity: 3500000,
    creditScore: 85,
  },
  {
    id: '3',
    customerName: '某科技有限公司',
    customerType: '企业客户',
    customerCategory: '中小企业',
    customerLevel: 'B级',
    contactPerson: '王五',
    contactPhone: '13700137000',
    contractStatus: '潜在客户',
    annualElectricity: 1800000,
    creditScore: 75,
  },
  {
    id: '4',
    customerName: '某商业广场',
    customerType: '企业客户',
    customerCategory: '中小企业',
    customerLevel: 'C级',
    contactPerson: '赵六',
    contactPhone: '13600136000',
    contractStatus: '已签约',
    annualElectricity: 2200000,
    creditScore: 80,
  },
  {
    id: '5',
    customerName: '王明',
    customerType: '个人客户',
    customerCategory: '居民用户',
    customerLevel: 'D级',
    contactPerson: '王明',
    contactPhone: '13500135000',
    contractStatus: '已签约',
    annualElectricity: 5000,
    creditScore: 70,
  },
];

const CustomerList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('customerName');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLevel, setSearchLevel] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const navigate = useNavigate();

  // 搜索过滤
  const filteredCustomers = mockCustomers.filter(customer => {
    let typeMatch = true;
    let categoryMatch = true;
    let levelMatch = true;
    let statusMatch = true;
    let textMatch = true;

    // 文本搜索
    if (searchText) {
      textMatch = customer[searchType].toLowerCase().includes(searchText.toLowerCase());
    }

    // 类别过滤
    if (searchCategory) {
      categoryMatch = customer.customerCategory === searchCategory;
    }

    // 级别过滤
    if (searchLevel) {
      levelMatch = customer.customerLevel === searchLevel;
    }

    // 状态过滤
    if (searchStatus) {
      statusMatch = customer.contractStatus === searchStatus;
    }

    return typeMatch && categoryMatch && levelMatch && statusMatch && textMatch;
  });

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text: string, record: any) => (
        <a onClick={() => navigate(`/customers/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '客户类型',
      dataIndex: 'customerType',
      key: 'customerType',
    },
    {
      title: '客户分类',
      dataIndex: 'customerCategory',
      key: 'customerCategory',
      render: (text: string) => {
        let color = '';
        if (text === '大客户') color = 'green';
        else if (text === '中小企业') color = 'blue';
        else color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '客户等级',
      dataIndex: 'customerLevel',
      key: 'customerLevel',
      render: (text: string) => {
        let color = '';
        if (text === 'A级') color = 'green';
        else if (text === 'B级') color = 'cyan';
        else if (text === 'C级') color = 'blue';
        else color = 'purple';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '合同状态',
      dataIndex: 'contractStatus',
      key: 'contractStatus',
      render: (text: string) => {
        let color = '';
        if (text === '已签约') color = 'green';
        else if (text === '潜在客户') color = 'orange';
        else if (text === '合同到期') color = 'red';
        else color = 'gray';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '年用电量(kWh)',
      dataIndex: 'annualElectricity',
      key: 'annualElectricity',
      render: (text: number) => text.toLocaleString(),
    },
    {
      title: '信用评分',
      dataIndex: 'creditScore',
      key: 'creditScore',
      render: (score: number) => {
        let color = '';
        if (score >= 90) color = 'green';
        else if (score >= 80) color = 'cyan';
        else if (score >= 70) color = 'blue';
        else if (score >= 60) color = 'orange';
        else color = 'red';
        return <Tag color={color}>{score}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="查看">
            <Button 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => navigate(`/customers/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => navigate(`/customers/${record.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
              onClick={() => {
                // 在实际应用中，这里应该弹出确认对话框，并调用删除API
                alert(`删除客户 ${record.customerName}`);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="客户管理" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/customers/create')}
          >
            新增客户
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="搜索客户"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              addonBefore={
                <Select 
                  value={searchType} 
                  onChange={setSearchType}
                  style={{ width: 100 }}
                >
                  <Option value="customerName">客户名称</Option>
                  <Option value="contactPerson">联系人</Option>
                  <Option value="contactPhone">联系电话</Option>
                </Select>
              }
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="客户分类"
              style={{ width: '100%' }}
              value={searchCategory}
              onChange={setSearchCategory}
              allowClear
            >
              <Option value="大客户">大客户</Option>
              <Option value="中小企业">中小企业</Option>
              <Option value="居民用户">居民用户</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="客户等级"
              style={{ width: '100%' }}
              value={searchLevel}
              onChange={setSearchLevel}
              allowClear
            >
              <Option value="A级">A级</Option>
              <Option value="B级">B级</Option>
              <Option value="C级">C级</Option>
              <Option value="D级">D级</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="合同状态"
              style={{ width: '100%' }}
              value={searchStatus}
              onChange={setSearchStatus}
              allowClear
            >
              <Option value="潜在客户">潜在客户</Option>
              <Option value="已签约">已签约</Option>
              <Option value="合同到期">合同到期</Option>
              <Option value="已终止">已终止</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredCustomers} 
          rowKey="id" 
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default CustomerList;