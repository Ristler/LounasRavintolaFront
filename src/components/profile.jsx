import React, { useState, useEffect } from 'react';
import { Card, Avatar, Statistic, Tabs, Button, Divider, Tag, 
  List, Spin, message, Modal, Table, Form, Input } from "antd";
import { UserOutlined, ShoppingOutlined, HeartOutlined, SettingOutlined, LogoutOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../hooks/orderApiHook';
import { deleteUser } from '../hooks/userApiHook';
import { useOrderModal }  from './orderModal';


export default function Profile() {
  const { user, loading: userLoading, refreshUser, logout } = useAuth(); // Use auth context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  
  const { handleModalOpen, ModalContent } = useOrderModal();

  //initial page load, refresh user data
  useEffect(() => {

    refreshUser();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user || !user._id) {
        console.log('No user ID available, skipping orders fetch');
        return;
      }

      try {
        const response = await getUserOrders(user._id);

        
        if (response) {
          setOrders(response);
          localStorage.setItem('orders', JSON.stringify(response));
        } else {
          console.log('No orders returned from API');
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?._id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {

      await refreshUser();
      

      const freshUserData = JSON.parse(localStorage.getItem('user'));
      const freshUser = freshUserData?.user || freshUserData;
      const userId = freshUser?._id;
      
      console.log('Fresh user ID from localStorage:', userId);
      
      if (userId) {
        const ordersData = await getUserOrders(userId);
        if (ordersData) {
          console.log('Fresh orders loaded:', ordersData);
          setOrders(ordersData);
          localStorage.setItem('orders', JSON.stringify(ordersData));
        } else {
          console.log('No orders returned for fresh user');
          setOrders([]);
        }
      } else {
        console.warn('No user ID available after refresh');
      }
      
      message.success('Tiedot päivitetty onnistuneesti');
    } catch (error) {
      console.error('Error refreshing data:', error);
      message.error('Tietojen päivitys epäonnistui');
    } finally {
      setRefreshing(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Ladataan käyttäjätietoja..." />
      </div>
    );
  }


  const userName = user.nimi || user.name || user.username || 'Käyttäjä';
  const userEmail = user.email || user.sähköposti || '';
  const userPoints = user.pisteet || user.points || 0;

  const showOrderDetail = (order) => {
    console.log("Selected order:", order);
    handleModalOpen(order);
  };

  const deleteAccount = () => {
    const choise = confirm("Oletko varma, että haluat poistaa tilisi lopullisesti? Poistettuja tilejä ei voida enää palauttaa")
    if (choise) {
      const userData = JSON.parse(localStorage.getItem('user'));
      try {
        const response = deleteUser(localStorage.getItem('token'), userData.user._id);
        if (response) {
          alert('Tilisi on nyt poistettu. Siirryt kirjautumissivulle');
          logout();
          
         
        }
      } catch (error) {
        console.log('error', error)
        alert("Virhe tilin poistossa. Yritä myöhemmin uudelleen ")
      }
    } else {
      alert("Peruutit toiminnon")
    }
    
  }

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
            <Button 
              type="text" 
              icon={<ReloadOutlined spin={refreshing} />} 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Päivitetään...' : 'Päivitä tiedot'}
            </Button>
          ]}
        >
          <div className="text-center pt-2 pb-4">
            <h2 className="text-xl font-bold">{userName}</h2>
            <p className="text-gray-500">{userEmail}</p>
          </div>
          
          <Divider className="my-3" />
          
          <div className="flex justify-around">
            <Statistic 
              title="Tilauksia" 
              value={orders?.length || 0} 
              className="text-center" 
              valueStyle={{ fontSize: '1.5rem' }}
            />

            <Statistic 
              title="Pisteet" 
              value={userPoints} 
              className="text-center" 
              valueStyle={{ fontSize: '1.5rem' }}
            />
          </div>
        </Card>
        
        {/* Orders tab with click handler */}
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
                    dataSource={orders}
                    renderItem={(item) => (
                      <List.Item
                        className="hover:bg-gray-50 rounded-lg p-2 cursor-pointer"
                        onClick={() => showOrderDetail(item)}
                        actions={[
                          <Button key="view" type="link" onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the List.Item click
                            showOrderDetail(item);
                          }}>
                            Näytä tiedot
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={`Tilaus #${item._id?.substring(0, 6) || item.id || 'Tuntematon'}`}
                          description={`Tilattu ${new Date(item.createdAt || item.date).toLocaleDateString('fi-FI') || 'Tuntematon päivämäärä'}`}
                        />
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-semibold text-gray-800">{item.totalPrice || 0}€</span>
                          <Tag color={item.status === 'delivered' || item.status === 'Delivered' ? 'green' : 'blue'}>
                            {item.status === 'delivered' || item.status === 'Delivered' ? 'Toimitettu' : 'Käsittelyssä'}
                          </Tag>
                        </div>
                      </List.Item>
                    )}
                    locale={{ emptyText: 'Ei tilaushistoriaa' }}
                  />
                ),
              },
              {
                key: 2,
                label: (
                  <span className="flex items-center">
                    <UserOutlined className="mr-2" />
                    Päivitä tiedot
                  </span>
                ),
                children: (<Form
                  layout="vertical"
                  initialValues={{
                    username: userName,
                    email: userEmail,
                    password: ''
                  }}
                  onFinish={(values) => {
                    console.log('Updated user information:', values)
                    const updatedData = {
                      nimi: values.username,
                      email: values.email,
                    };
                    if (values.password) {
                      updatedData.salasana = values.password;
                    }

                    try {
                      const response = optionsUser('PUT', localStorage.getItem('token'), updatedData)
                      if (response) {
                        alert("Tiedot päivitetty onnistuneesti!", response)
                      }                      
                    } catch (error) {
                      alert("Tapahtui odottamaton virhe", error)
                    }
                    
                    message.success('Tietosi on päivitetty onnistuneesti!');
                  }}
                > Alla näet omat tietosi. Jos haluat päivittää tietojasi, muuta haluamasi kentät ja paina 'Päivitä tiedot'. Jos et halua tehdä muutoksia, jätä kentät ennalleen.
                  <Form.Item
                    label="Käyttäjänimi"
                    name="username"
                  >
                    <Input placeholder="Syötä uusi käyttäjänimi" />
                  </Form.Item>
                
                  <Form.Item
                    label="Sähköposti"
                    name="email"
                    rules={[
                      { type: 'email', message: 'Syötä kelvollinen sähköpostiosoite' },
                    ]}
                  >
                    <Input placeholder="Syötä uusi sähköpostiosoite" />
                  </Form.Item>
                
                  <Form.Item
                    label="Salasana"
                    name="password"
                    rules={[
                      { required: false, message: 'Salasana on pakollinen' },
                      { min: 8, message: 'Salasanan on oltava vähintään 8 merkkiä pitkä' },
                    ]}
                  >
                    <Input.Password placeholder="Syötä uusi salasana" />
                  </Form.Item>
                
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Päivitä tiedot
                    </Button>

                    <Button type="primary" danger onClick={() => deleteAccount()}>
                      Poista tili
                    </Button>
                  </Form.Item>
                </Form>)
                
              }
              
            ]}
          />
        </div>
        
      </div>
      
      {/* Render Detail Modal */}
      <ModalContent />
      
    </div>
  );
}
