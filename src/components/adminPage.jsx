import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  message, 
  Tag, 
  Spin, 
  Modal, 
  Space, 
  Typography,
  Badge
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  EyeOutlined, 
  ShoppingCartOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
//import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../context/AuthContext';
import { getAllOrders, pathOrderStatus } from '../hooks/orderApiHook';

const { Title, Text } = Typography;
const { confirm } = Modal;

const AdminPage = () => {
  //const { user, isAuthenticated } = useAuth();
  //const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
   
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      console.log('Fetched orders:', response);
      console.log('Response structure:', {
        hasData: !!response?.data,
        dataType: response?.data ? typeof response.data : 'undefined',
        isArray: response?.data ? Array.isArray(response.data) : false,
        length: response?.data?.length || 0
      });
      if (response) {
        if (Array.isArray(response)) {
          console.log('Response is directly an array of length:', response.length);
          
          const processedOrders = processOrderData(response);
          setOrders(processedOrders);
          return;
        }
        if (response.data && Array.isArray(response.data)) {
          console.log('Response.data is an array of length:', response.data.length);
          
          if (response.data.length === 0) {
            message.info('Ei tilauksia löytynyt');
            setOrders([]);
            return;
          }
          const processedOrders = processOrderData(response.data);
          setOrders(processedOrders);
          return;
        }
        message.error('Virheellinen vastausformaatti');
        setOrders([]);
      } else {
        console.log('No response or empty response');
        setOrders([]);
        message.warning('Ei tilauksia saatavilla');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Tilausten hakeminen epäonnistui');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };


  const processOrderData = (orders) => {

    const validOrders = orders.filter(order => {
      if (!order) return false;
      return true;
    });
    const processedOrders = validOrders.map(order => {

      return {
        ...order,
        totalPrice: Number(order.totalPrice || 0),
        items: Array.isArray(order.items) ? order.items.map(item => ({
          ...item,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1)
        })) : []
      };
    });

    return processedOrders.sort((a, b) => 
      new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
    );
  };


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };


  const handleViewOrderDetails = (order) => {
    setCurrentOrder(order);
    setModalVisible(true);
  };

  const handleStatusChange = async (orderId, status) => {
    try {
        console.log('Updating order status:', orderId, status);

        const response = await pathOrderStatus(orderId, status);
        console.log('Order status updated:', response);
        if (!response) {
            message.error('Tilan päivitys epäonnistui');
            return;
        }
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
      
      message.success(`Tilauksen tila päivitetty: ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Tilan päivitys epäonnistui');
    }
  };


  //NOT USED NOW. 
  const showConfirm = (orderId) => {
    confirm({
      title: 'Merkitse tilaus valmiiksi?',
      content: 'Tilaus merkitään valmiiksi ja asiakkaalle lähetetään ilmoitus.',
      okText: 'Kyllä',
      okType: 'primary',
      cancelText: 'Peruuta',
      onOk() {
        handleStatusChange(orderId, 'completed');
      },
    });
  };


  
  const columns = [
    {
      title: 'Tilaus ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => {
        if (!id) return 'Tuntematon';
        return (
          <Text
            copyable={{
              text: id, 
              tooltips: ['Kopioi ID', 'ID kopioitu!'],
            }}
            className="font-mono text-xs"
          >
            {id.substr(0, 8)}...
          </Text>
        );
      },
    },
    {
      title: 'Asiakas',
      dataIndex: 'user',
      key: 'user',
      render: (_, record) => (
        <span>
          <UserOutlined className="mr-1" />
          {record.user?.name || record.userId || 'Tuntematon'}
        </span>
      ),
    },
    {
      title: 'Aika',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <span>
          <CalendarOutlined className="mr-1" />
          {date ? new Date(date).toLocaleString('fi-FI') : 'Tuntematon'}
        </span>
      ),
    },
    {
      title: 'Tuotteet',
      dataIndex: 'items',
      key: 'items',
      render: (items) => <Tag color="blue">{items?.length || 0} tuotetta</Tag>,
    },
    {
      title: 'Summa',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => <Text strong>{(price || 0).toFixed(2)} €</Text>,
    },
    {
      title: 'Tila',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let text = 'Odottaa';
        
        if (status === 'processing') {
          color = 'processing';
          text = 'Käsittelyssä';
        } else if (status === 'completed') {
          color = 'success';
          text = 'Valmis';
        }
        
        return <Badge status={color} text={text} />;
      },
    },
    {
      title: 'Toiminnot',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleViewOrderDetails(record)}
            size="small"
          >
            Näytä
          </Button>
          
          {record.status !== 'completed' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              onClick={() => handleStatusChange(record._id, 'completed')}
              size="small"
            >
              Valmis
            </Button>
          )}

        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Card className="mb-4">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
          <Title level={2} className="mb-4 lg:mb-0">
            <ShoppingCartOutlined className="mr-2" />
            Hallintapaneeli: Tilaukset
          </Title>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshing}
            >
              Päivitä
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spin size="large" tip="Ladataan tilauksia..." />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCartOutlined style={{ fontSize: '48px', color: '#ccc' }} />
              <p className="mt-3 text-gray-500">Ei tilauksia</p>
            </div>
          ) : (
            <Table
              dataSource={orders} 
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          )}
        </div>
      </Card>
      
      {/* Order Details Modal */}
      <Modal
        title="Tilauksen tiedot"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            Sulje
          </Button>,

          currentOrder && currentOrder.status !== 'completed' && (
            <Button
              key="complete"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                handleStatusChange(currentOrder._id, 'completed');
                setModalVisible(false);
              }}
            >
              Merkitse valmiiksi
            </Button>
          ),
        ]}
        width={700}
      >
        {currentOrder && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Text type="secondary">Tilaus ID:</Text>
                <p className="font-mono">{currentOrder._id}</p>
                
                <Text type="secondary">Tilaaja:</Text>
                <p>{currentOrder.user?.name || currentOrder.userId || 'Tuntematon'}</p>
                
                <Text type="secondary">Tilauspäivä:</Text>
                <p>{currentOrder.createdAt ? new Date(currentOrder.createdAt).toLocaleString('fi-FI') : 'Tuntematon'}</p>
              </div>
              
              <div>
                <Text type="secondary">Tila:</Text>
                <p>
                  <Badge 
                    status={
                      currentOrder.status === 'completed' ? 'success' : 
                      currentOrder.status === 'processing' ? 'processing' : 'default'
                    } 
                    text={
                      currentOrder.status === 'completed' ? 'Valmis' : 
                      currentOrder.status === 'processing' ? 'Käsittelyssä' : 'Odottaa'
                    } 
                  />
                </p>
                
                <Text type="secondary">Kokonaishinta:</Text>
                <p className="font-bold">{(currentOrder.totalPrice || 0).toFixed(2)} €</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Title level={5}>Tilatut tuotteet:</Title>
              {currentOrder.items && currentOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between border-b py-2">
                  <div>
                    <p className="font-medium">{item.name || `Tuote ID: ${item.foodId}`}</p>
                    <Text type="secondary">Määrä: {item.quantity}</Text>
                  </div>
                  <p className="font-medium">{(item.price || 0).toFixed(2)} €</p>
                </div>
              ))}
              
              <div className="flex justify-between mt-4 font-bold">
                <p>Yhteensä:</p>
                <p>{(currentOrder.totalPrice || 0).toFixed(2)} €</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPage;