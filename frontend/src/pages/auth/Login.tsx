import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: LoginFormValues) => {
    setLoading(true);
    
    // 在实际应用中，这里应该调用API进行登录验证
    // 这里模拟一个登录过程
    setTimeout(() => {
      if (values.email === 'admin@example.com' && values.password === 'password') {
        message.success('登录成功');
        
        // 存储token（模拟）
        localStorage.setItem('token', 'simulated-jwt-token');
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          name: '管理员',
          email: values.email,
          role: 'admin'
        }));
        
        navigate('/');
      } else {
        message.error('邮箱或密码错误');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>售电公司业务中台</Title>
          <p style={{ color: '#666' }}>账号登录</p>
        </div>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="邮箱" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <a style={{ float: 'right' }} href="/forgot-password">
              忘记密码
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <a href="/register">注册账号</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 