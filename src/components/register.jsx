import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { newUser } from '../hooks/userApiHook';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Registration form values:', values.name, values.email, values.password);
      
      const response = await newUser(values);
      console.log('Registration API response:', response);
      
      if (response) {
        message.success('Rekisteröityminen onnistui!');
        navigate('/kirjaudu'); // Redirect to home page
      } else {
        throw new Error('Rekisteröityminen epäonnistui - virheellinen vastaus');
      }
    } catch (error) {
      message.error(error.message || 'Rekisteröityminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-full p-4">
      <Card title="Rekisteröidy" className="w-full max-w-md">
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Syötä nimesi' },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nimi" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Syötä sähköpostiosoite!' },
              { type: 'email', message: 'Syötä kelvollinen sähköpostiosoite!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Sähköposti" 
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
              Liity mukaan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}