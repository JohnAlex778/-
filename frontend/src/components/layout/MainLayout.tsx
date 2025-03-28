import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, theme } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SwapOutlined,
  BarChartOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  BankOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('仪表盘', '/', <DashboardOutlined />),
  getItem('客户管理', 'customer', <TeamOutlined />, [
    getItem('客户列表', '/customers'),
    getItem('新增客户', '/customers/create'),
  ]),
  getItem('合同计费', 'contract', <FileTextOutlined />, [
    getItem('合同列表', '/contracts'),
    getItem('新增合同', '/contracts/create'),
    getItem('账单管理', '/bills'),
  ]),
  getItem('交易运营', 'trading', <SwapOutlined />, [
    getItem('交易计划', '/trading-plans'),
    getItem('市场分析', '/market-analysis'),
  ]),
  getItem('能源数据', 'energy-data', <BarChartOutlined />, [
    getItem('数据概览', '/energy-data'),
    getItem('负荷曲线', '/energy-data/load-profile'),
    getItem('负荷预测', '/energy-data/load-forecast'),
    getItem('数据导入', '/energy-data/import'),
  ]),
  getItem('风险管理', 'risk', <SafetyOutlined />, [
    getItem('风险概览', '/risk-management'),
    getItem('风险评估', '/risk-management/assessments'),
  ]),
  getItem('能源服务', 'services', <ThunderboltOutlined />, [
    getItem('服务列表', '/energy-services'),
    getItem('新增服务', '/energy-services/create'),
    getItem('绿证交易', '/energy-services/green-certificates'),
  ]),
  getItem('财务管理', 'finance', <BankOutlined />, [
    getItem('财务概览', '/finance'),
    getItem('财务报表', '/finance/reports'),
    getItem('发票管理', '/finance/invoices'),
    getItem('收付款跟踪', '/finance/payments'),
  ]),
  getItem('运营管理', 'operations', <SettingOutlined />, [
    getItem('运营概览', '/operations'),
    getItem('任务管理', '/operations/tasks'),
    getItem('业绩指标', '/operations/performance'),
    getItem('用户管理', '/operations/users'),
  ]),
];

const userDropdownItems: MenuProps['items'] = [
  {
    key: '1',
    label: '个人中心',
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: '修改密码',
    icon: <SafetyOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: '3',
    label: '退出登录',
    icon: <LogoutOutlined />,
    danger: true,
  },
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  // 查找当前选中的菜单项
  const findSelectedKeys = () => {
    // 首页直接匹配
    if (location.pathname === '/') {
      return ['/'];
    }

    // 其他页面查找最匹配的路径
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return ['/'];

    const basePath = `/${pathSegments[0]}`;
    return [location.pathname];
  };

  // 查找当前打开的子菜单
  const findOpenKeys = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return [];

    // 查找一级菜单key
    const menuKey = items.find(item => {
      if (!item) return false;
      const itemKey = String(item.key);
      return pathSegments[0].includes(itemKey.replace('/', ''));
    })?.key;

    return menuKey ? [String(menuKey)] : [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" style={{ height: 64, padding: 16, color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', lineHeight: '32px' }}>
          {!collapsed ? '售电公司业务中台' : '售电'}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={findSelectedKeys()}
          defaultOpenKeys={findOpenKeys()}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
            <Button type="text" icon={<BellOutlined />} size="large" />
            
            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 16 }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: 8, marginRight: 8 }}>管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;