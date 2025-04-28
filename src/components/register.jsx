import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();



  //SIMULOIDAAN REKISTERÖITYMISTÄ, TÄÄ PITÄÄ VAIHTAA OIKEEEN API KUTSUUN
  const onFinish = async (values) => {
    try {
      
      console.log('Login form values:', values);
      
   
      localStorage.setItem('token', 'example-token');
      message.success('Kirjautuminen onnistui!');
      navigate('/profiili');
    } catch (error) {
      message.error('Kirjautuminen epäonnistui!');
    }
  };


  return (
    <div className="flex justify-center items-center min-h-full p-4">
      <Card title="Rekisteröidy" className="w-full max-w-md">
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
            <Button type="primary" htmlType="submit" className="w-full" size="large">
              Liity mukaan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}