import {fetchData} from '../utils/fetchData';

const userApiUrl = import.meta.env.VITE_USERS_API;

const newUser = async (user) => {
    try {
        if (!userApiUrl) {
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
            email: user.email,   
            salasana: user.password  
          })
        };
        
        const response = await fetchData(`${userApiUrl}/user`, options);
        return response;
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (token, userId) => {
  try {
      if (!userApiUrl) {
        throw new Error('API URL is undefined. Check your environment variables.');
      }
      const options = {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer: ${token}`
        },
      };
      
      const response = await fetchData(`${userApiUrl}/${userId}`, options);
      return response;
  } catch (error) {
      throw error;
  }
};

const modifyUser = async (token, userId, data) => {
    try {
        if (!userApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
        const options = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...data 
          })
        };
        return response;
    } catch (error) {
        throw error;
    }
  }

export {newUser, deleteUser, modifyUser};
