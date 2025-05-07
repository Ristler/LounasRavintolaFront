import React, { useState } from 'react';
import { Button, message, Modal } from 'antd';
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext';
import { newOrder } from '../hooks/orderApiHook';

const ShoppingCart = () => {
  const { cartItems, addToCart, increaseQuantity, removeFromCart, removeItemCompletely, getCartTotal } = useCart();
  const { user, isAuthenticated } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { confirm } = Modal;


  const handleOrder = async () => {

    if (!isAuthenticated) {
      console.log("User not logged in:", user);
      
      confirm({
        title: 'Kirjautuminen vaaditaan',
        icon: <ExclamationCircleOutlined />,
        content: 'Sinun täytyy kirjautua sisään tehdäksesi tilauksen.',
        okText: 'Kirjaudu sisään',
        cancelText: 'Peruuta',
        onOk() {
          navigate('/kirjaudu');
        },
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const order = {
        userId: user._id,
        items: cartItems.map(item => ({
          foodId: item.id, 
          quantity: Number(item.quantity || 1),
          price: Number(item.price)
        })),
        totalPrice: Number(getCartTotal().toFixed(2)),
        orderScore: 10
      };
  
      console.log("Sending order:", order);
      const response = await newOrder(order);
      console.log("Order response:", response);
      
      message.success("Tilaus vastaanotettu!");
     
      cartItems.forEach(item => {
        removeItemCompletely ? removeItemCompletely(item.id) : removeFromCart(item.id);
      });
    
    } catch (error) {
      console.error("Error creating order:", error);
      message.error("Tilauksen luominen epäonnistui");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-w-[280px] max-h-[400px] overflow-y-auto py-2">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center py-6">
          <ShoppingCartOutlined className="text-3xl text-gray-300 mb-2" />
          <p className="text-gray-500">Ostoskori on tyhjä</p>
        </div>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-3 p-2 hover:bg-gray-50 rounded-lg transition duration-150">
              <div className="flex items-center gap-3">
                <img 
                  src={item.photo} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded-md shadow-sm"
                />
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="block text-xs text-gray-500">
                    {item.price.toFixed(2)}€
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center border rounded-md mr-2">
                  <Button 
                    type="text" 
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-blue-500 border-0" 
                  />
                  <span className="px-2 text-sm">
                    {item.quantity || 1}
                  </span>
                  <Button 
                    type="text" 
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => increaseQuantity(item.id)}
                    className="text-gray-500 hover:text-blue-500 border-0" 
                  />
                </div>
                
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeItemCompletely ? removeItemCompletely(item.id) : removeFromCart(item.id)}
                  className="flex items-center justify-center hover:bg-red-50"
                />
              </div>
            </div>
          ))}
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-bold mb-2">
              <span>Yhteensä:</span>
              <span className="text-orange-500">{getCartTotal().toFixed(2)}€</span>
            </div>
            
            <div className="text-xs text-gray-500 mb-3 text-right">
              {cartItems.reduce((total, item) => total + (item.quantity || 1), 0)} tuotetta
            </div>
            
            <Button 
              type="primary" 
              className="w-full h-10 text-base font-medium shadow-md bg-blue-600 hover:bg-blue-700"
              onClick={handleOrder}
              loading={loading}
              disabled={cartItems.length === 0}
            >
              {!user ? 'Kirjaudu sisään tilataksesi' : 'Tilaa'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;