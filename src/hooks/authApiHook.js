import {fetchData} from '../utils/fetchData';

const authApiUrl = import.meta.env.VITE_AUTH_API;

const userLogin = async (user) => {
    try {
        if (!authApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
  
        console.log(authApiUrl);
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
  
        const response = await fetchData(`${authApiUrl}`, options);


        console.log('User logged in successfully:', response);
        return response;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
  };
  
  export {userLogin}