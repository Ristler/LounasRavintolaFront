import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../hooks/authApiHook';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { loginSuccess } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    
    try {
     
      const response = await userLogin(values);
      
      console.log('Login API response:', response);
      
      if (!response || !response.token) {
        console.error('Invalid response format:', response);
        setError('Virheellinen vastaus palvelimelta');
        return;
      }
      
      const userData = {
        _id: response._id,
        name: response.name || response.nimi,
        email: response.email,
      };
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({ user: userData }));
      
      console.log('Stored in localStorage:', { 
        token: response.token.substring(0, 10) + '...',
        user: userData
      });

      loginSuccess(userData, response.token);
      
      message.success('Kirjautuminen onnistui!', 2);
      

      setTimeout(() => {
        navigate('/profiili');
      }, 2000);
    } catch (error) {
      console.error('Login error details:', error);
      
  
      let errorMessage = 'Kirjautuminen epäonnistui';
      if (error.response) {
        console.log('Error response:', error.response);
    
      }
      
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-full p-4">
      <Card title="Kirjaudu sisään" className="w-full max-w-md">
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}
        
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Syötä nimi!' },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nimi" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Syötä salasana!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Salasana"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full" 
              size="large"
              loading={loading}
            >
              Kirjaudu sisään
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}