import {fetchData} from '../utils/fetchData';
const authApiUrl = import.meta.env.VITE_AUTH_API;

const userLogin = async (user) => {
    try {
        if (!authApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
  
        const options = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nimi: user.name,   
            salasana: user.password  
          })
        };
        const response = await fetchData(`${authApiUrl}/login`, options);
        return response;
    } catch (error) {
        throw error;
    }
};
const userLogout = async () => {

    try {
        if (!authApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please log in.');
        } 
        const options = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await fetchData(`${authApiUrl}/logout`, options);
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return response;
    } catch (error) {   
        // If token is invalid, clear localStorage
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        throw error;
    }
};


const getMe = async () => {
    try {
        if (!authApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please log in.');
        }
        
        const options = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Assuming your API has a /me endpoint - adjust the URL as needed
        const response = await fetchData(`${authApiUrl}/getMe`, options);
        
        return response;
    } catch (error) {
        // If token is invalid, clear localStorage
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        throw error;
    }
};

export {userLogin, getMe, userLogout}