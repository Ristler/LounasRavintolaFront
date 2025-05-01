import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../hooks/authApiHook';

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const response = await userLogin(values);
      console.log('Kirjautuminen onnistui:', response);

   
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('token', response.token);
      
      // Use the messageApi instance to show messages
      messageApi.success('Kirjautuminen onnistui!');

      setTimeout(() => {
        navigate('/profiili');
      }, 1800);

    } catch (error) {
      messageApi.error('Kirjautuminen epäonnistui!');


      console.error('Login error:', error);

    }
  };

  return (
    <div className="flex justify-center items-center min-h-full p-4">
      {/* This renders the message container */}
      {contextHolder}
      
      <Card title="Kirjaudu sisään" className="w-full max-w-md">
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          {/* Form items remain the same */}
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
            <Button type="primary" htmlType="submit" className="w-full" size="large">
              Kirjaudu sisään
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}