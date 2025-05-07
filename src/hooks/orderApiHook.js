import {fetchData} from '../utils/fetchData';

const orderApiUrl = import.meta.env.VITE_ORDER_API;

const newOrder = async (order) => {
    try {
        if (!orderApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }

        
        console.log(orderApiUrl);
        const options = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            userId: order.userId,
            items: order.items, 
            totalPrice: Number(order.totalPrice),
            orderScore: Number(order.orderScore)
          })
        };
        
        const response = await fetchData(`${orderApiUrl}`, options);
        console.log('Order created successfully:', response);
        return response;
    } catch (error) {
        
       
        throw error;
    }
};






const getUserOrders = async (userId) => {
    try {
        if (!orderApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
        
        const options = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        const response = await fetchData(`${orderApiUrl}/user/${userId}`, options);
        return response;
    } catch (error) {
        console.error('Error fetching user orders:', error);
   
        
    
    }
}
const getOrderById = async (orderId) => {
    try {
        if (!orderApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
        
        const options = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        if(response.status === 404) {
            console.error('Orders not found');
            return null;
        }
        
        const response = await fetchData(`${orderApiUrl}/${orderId}`, options);
        console.log('Order retrieved successfully:', response);
        return response;
    } catch (error) {
        console.error('Error fetching order:', error);
   
    }
}


const getAllOrders = async () => {
    try { 
        if (!orderApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
        const options = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const response = await fetchData(`${orderApiUrl}`, options);
        console.log('All orders retrieved successfully:', response);
        return response;
    }

    catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
}

const pathOrderStatus = async (orderId, status) => {
    try {
        if (!orderApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
        
        const options = {
          method: 'PATCH',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        };
        
        const response = await fetchData(`${orderApiUrl}/${orderId}/${status}`, options);
        console.log('Order status updated successfully:', response);
        return response;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

export {newOrder, getUserOrders, getOrderById, getAllOrders, pathOrderStatus};
