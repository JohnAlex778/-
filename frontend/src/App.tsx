import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

// 布局组件
import MainLayout from './components/layout/MainLayout';

// 页面组件
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// 客户管理页面
import CustomerList from './pages/customer-management/CustomerList';
import CustomerDetail from './pages/customer-management/CustomerDetail';
import CustomerCreate from './pages/customer-management/CustomerCreate';
import CustomerEdit from './pages/customer-management/CustomerEdit';

// 合同计费页面
import ContractList from './pages/contract-billing/ContractList';
import ContractDetail from './pages/contract-billing/ContractDetail';
import ContractCreate from './pages/contract-billing/ContractCreate';
import BillList from './pages/contract-billing/BillList';
import BillDetail from './pages/contract-billing/BillDetail';

// 交易运营页面
import TradingPlanList from './pages/trading-operations/TradingPlanList';
import TradingPlanDetail from './pages/trading-operations/TradingPlanDetail';
import TradingPlanCreate from './pages/trading-operations/TradingPlanCreate';
import MarketAnalysis from './pages/trading-operations/MarketAnalysis';

// 能源数据页面
import EnergyDataDashboard from './pages/energy-data/EnergyDataDashboard';
import LoadProfile from './pages/energy-data/LoadProfile';
import DataImport from './pages/energy-data/DataImport';
import LoadForecast from './pages/energy-data/LoadForecast';

// 风险管理页面
import RiskDashboard from './pages/risk-management/RiskDashboard';
import RiskAssessmentList from './pages/risk-management/RiskAssessmentList';
import RiskAssessmentDetail from './pages/risk-management/RiskAssessmentDetail';
import RiskAssessmentCreate from './pages/risk-management/RiskAssessmentCreate';

// 能源服务页面
import EnergyServiceList from './pages/energy-services/EnergyServiceList';
import EnergyServiceDetail from './pages/energy-services/EnergyServiceDetail';
import EnergyServiceCreate from './pages/energy-services/EnergyServiceCreate';
import GreenCertificateTrading from './pages/energy-services/GreenCertificateTrading';

// 财务页面
import FinanceDashboard from './pages/finance/FinanceDashboard';
import FinancialReport from './pages/finance/FinancialReport';
import InvoiceManagement from './pages/finance/InvoiceManagement';
import PaymentTracking from './pages/finance/PaymentTracking';

// 运营管理页面
import OperationsDashboard from './pages/operations-management/OperationsDashboard';
import TaskManagement from './pages/operations-management/TaskManagement';
import PerformanceMetrics from './pages/operations-management/PerformanceMetrics';
import UserManagement from './pages/operations-management/UserManagement';

// 样式
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 认证路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 主应用路由 */}
          <Route path="/" element={<MainLayout />}>
            {/* 仪表盘 */}
            <Route index element={<Dashboard />} />

            {/* 客户管理路由 */}
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/create" element={<CustomerCreate />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="customers/:id/edit" element={<CustomerEdit />} />

            {/* 合同计费路由 */}
            <Route path="contracts" element={<ContractList />} />
            <Route path="contracts/create" element={<ContractCreate />} />
            <Route path="contracts/:id" element={<ContractDetail />} />
            <Route path="bills" element={<BillList />} />
            <Route path="bills/:id" element={<BillDetail />} />

            {/* 交易运营路由 */}
            <Route path="trading-plans" element={<TradingPlanList />} />
            <Route path="trading-plans/create" element={<TradingPlanCreate />} />
            <Route path="trading-plans/:id" element={<TradingPlanDetail />} />
            <Route path="market-analysis" element={<MarketAnalysis />} />

            {/* 能源数据路由 */}
            <Route path="energy-data" element={<EnergyDataDashboard />} />
            <Route path="energy-data/load-profile" element={<LoadProfile />} />
            <Route path="energy-data/load-forecast" element={<LoadForecast />} />
            <Route path="energy-data/import" element={<DataImport />} />

            {/* 风险管理路由 */}
            <Route path="risk-management" element={<RiskDashboard />} />
            <Route path="risk-management/assessments" element={<RiskAssessmentList />} />
            <Route path="risk-management/assessments/create" element={<RiskAssessmentCreate />} />
            <Route path="risk-management/assessments/:id" element={<RiskAssessmentDetail />} />

            {/* 能源服务路由 */}
            <Route path="energy-services" element={<EnergyServiceList />} />
            <Route path="energy-services/create" element={<EnergyServiceCreate />} />
            <Route path="energy-services/:id" element={<EnergyServiceDetail />} />
            <Route path="energy-services/green-certificates" element={<GreenCertificateTrading />} />

            {/* 财务路由 */}
            <Route path="finance" element={<FinanceDashboard />} />
            <Route path="finance/reports" element={<FinancialReport />} />
            <Route path="finance/invoices" element={<InvoiceManagement />} />
            <Route path="finance/payments" element={<PaymentTracking />} />

            {/* 运营管理路由 */}
            <Route path="operations" element={<OperationsDashboard />} />
            <Route path="operations/tasks" element={<TaskManagement />} />
            <Route path="operations/performance" element={<PerformanceMetrics />} />
            <Route path="operations/users" element={<UserManagement />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App; 