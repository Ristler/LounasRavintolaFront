import React, { useEffect, useState } from 'react';
import { Card, Button, message, Spin, Typography, Badge } from "antd";
import { ShoppingCartOutlined, HeartOutlined  } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { getAllFoods } from '../hooks/foodApiHook';

const { Title, Paragraph } = Typography;

export default function OrderFood() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllFoods();
        setFoodItems(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
        message.error('Virhe tietojen lataamisessa');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFood = (food) => {
    addToCart(food);
    message.success({
      content: `${food.name} lisätty ostoskoriin!`,
      icon: <ShoppingCartOutlined style={{ color: '#52c41a' }} />
    });
  };

  const renderFood = (food) => {
    return (
      <Badge.Ribbon 
        text={food.vegetarian ? "Kasvis" : ""}
        color={food.vegetarian ? "green" : "transparent"}
        key={food.id}
      >
        <Card 
          hoverable
          className="w-full h-full shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
          cover={
            <div className="overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
              <img 
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110" 
                src={food.photo} 
                alt={food.name}
                loading="lazy"
              />
            </div>
          }
        >
          <div className="flex flex-col h-48">
            <Title level={4} className="mb-1">{food.name}</Title>
        
            <Paragraph 
              className="text-gray-600 mb-2 flex-grow overflow-hidden"
              ellipsis={{ rows: 2 }}
            >
              {food.desc}
            </Paragraph>
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
              <span className="text-lg font-bold text-orange-500">{food.price} €</span>
              <Button 
                type="primary" 
                size="middle"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleFood(food)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Lisää koriin
              </Button>
            </div>
          </div>
        </Card>
      </Badge.Ribbon>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Ladataan ruokia..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            <span className="inline-block pb-2 border-b-2 border-orange-400">Meidän Herkullinen</span>{' '}
            <span className="text-orange-500">Valikoima</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Tuoretta ja maukasta ruokaa jokaiseen makuun <HeartOutlined style={{color: '#fb923c'}}/>
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {foodItems.map(food => renderFood(food))}
        </div>
        
        {foodItems.length > 0 && (
          <div className="mt-16 text-center">
            
           
          </div>
        )}
      </div>
    </div>
  );
}