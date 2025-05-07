import {fetchData} from '../utils/fetchData';

const orderApiUrl = import.meta.env.VITE_ORDER_API;

const newOrder = async (order) => {
    try {
        if (!orderApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }

        
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
      throw error;
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
            return null;
        }
        
        const response = await fetchData(`${orderApiUrl}/${orderId}`, options);
        return response;
    } catch (error) {
      throw error;
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
        return response;
    }

    catch (error) {
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
        return response;
    } catch (error) {
        throw error;
    }
}

export {newOrder, getUserOrders, getOrderById, getAllOrders, pathOrderStatus};
