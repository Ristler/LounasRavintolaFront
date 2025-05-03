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
            items: order.items, // Keep the same structure
            totalPrice: Number(order.totalPrice),
            orderScore: Number(order.orderScore)
          })
        };
        
        const response = await fetchData(`${orderApiUrl}`, options);
        console.log('Order created successfully:', response);
        return response;
    } catch (error) {
        console.error('Error creating order:', error);
        console.log('Order details:', order);
        throw error;
    }
};

export {newOrder};
