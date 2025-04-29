import {fetchData} from '../utils/fetchData';

const userApiUrl = import.meta.env.VITE_USERS_API;

const newUser = async (user) => {
    try {
        if (!userApiUrl) {
          throw new Error('API URL is undefined. Check your environment variables.');
        }
        console.log(userApiUrl);
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
        console.log('User created successfully:', response);
        return response;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export {newUser};
