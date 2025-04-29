import React, { useState, useEffect } from 'react';
import { Card, Avatar, Statistic, Tabs, Button, Divider, Tag, List } from "antd";
import { UserOutlined, ShoppingOutlined, HeartOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/kirjaudu');
      return;
    }
    setUser(userData);
  }, [navigate]);


  // MOCK DATA. MYÖHEMMIN OIKEAA DATAA
  const orderHistory = [
    { id: '1001', date: '2023-04-25', total: 24.50, status: 'delivered' },
    { id: '982', date: '2023-04-18', total: 18.90, status: 'delivered' },
    { id: '879', date: '2023-03-30', total: 32.75, status: 'delivered' }
  ];

  //MOCK DATA. MYÖHEMMIN OIKEAA DATAA
  const favoriteItems = [
    { id: 1, name: 'Lohikeitto', price: 12.90 },
    { id: 2, name: 'Kasvispasta', price: 10.50 }
  ];

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information Card */}
        <Card 
          className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow duration-300"
          cover={
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-32 flex items-end justify-center pb-10">
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                className="border-4 border-white shadow-md bg-blue-800"
              />
            </div>
          }
          actions={[
            <Button type="text" icon={<SettingOutlined />}>Asetukset</Button>,

          ]}
        >
          <div className="text-center pt-2 pb-4">
            <h2 className="text-xl font-bold">{user.nimi || 'Käyttäjä'}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          
          <Divider className="my-3" />
          
          <div className="flex justify-around">
            <Statistic 
              title="Tilauksia" 
              value={orderHistory.length} 
              className="text-center" 
              valueStyle={{ fontSize: '1.5rem' }}
            />
            <Statistic 
              title="Suosikkeja" 
              value={favoriteItems.length} 
              className="text-center"
              valueStyle={{ fontSize: '1.5rem' }}
            />
             <Statistic 
              title="Pisteet" 
              value={user.pisteet} 
              className="text-center" 
              valueStyle={{ fontSize: '1.5rem' }}
            />
          </div>
        </Card>
        
        {/* Activity Tabs */}
        <div className="md:col-span-2">
          <Tabs
            defaultActiveKey="1"
            className="bg-white rounded-lg shadow-md p-4"
            items={[
              {
                key: '1',
                label: (
                  <span className="flex items-center">
                    <ShoppingOutlined className="mr-2" />
                    Tilaushistoria
                  </span>
                ),
                children: (
                  <List
                    itemLayout="horizontal"
                    dataSource={orderHistory}
                    renderItem={(item) => (
                      <List.Item
                        className="hover:bg-gray-50 rounded-lg p-2"
                        actions={[
                         
                        ]}
                      >
                        <List.Item.Meta
                          title={`Tilaus #${item.id}`}
                          description={`Tilattu ${item.date}`}
                        />
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-semibold text-gray-800">{item.total.toFixed(2)}€</span>
                          <Tag color="green">{item.status === 'delivered' ? 'Toimitettu' : 'Käsittelyssä'}</Tag>
                        </div>
                      </List.Item>
                    )}
                  />
                ),
              },
              {
                key: '2',
                label: (
                  <span className="flex items-center">
                    <HeartOutlined className="mr-2" />
                    Suosikit
                  </span>
                ),
                children: (
                  <List
                    itemLayout="horizontal"
                    dataSource={favoriteItems}
                    renderItem={(item) => (
                      <List.Item
                        className="hover:bg-gray-50 rounded-lg p-2"
                        actions={[
                          <Button size="small" type="primary" className="bg-blue-500">
                            Lisää koriin
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={item.name}
                          description="Suosikkiruokasi"
                        />
                        <div>
                          <span className="font-semibold text-orange-500">{item.price.toFixed(2)}€</span>
                        </div>
                      </List.Item>
                    )}
                    locale={{ emptyText: 'Ei vielä suosikkeja' }}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
