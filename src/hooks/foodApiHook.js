import {fetchData} from '../utils/fetchData';

const foodApiUrl = import.meta.env.VITE_FOODS_API;

console.log('Food API URL:', foodApiUrl);

const getAllFoods = async () => {
  try {
    if (!foodApiUrl) {
      throw new Error('API URL is undefined. Check your environment variables.');
    }
    // Add options object with mode: 'cors'
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await fetchData(foodApiUrl, options);
    console.log('Foods fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
};

const getFoodsById  = async (foodId) => {
  try {
    if (!foodApiUrl) {
      throw new Error('API URL is undefined. Check your environment variables.');
    }

    const options = {
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
      }
    };

    const response = await fetchData(`http://localhost:3000/foods/${foodId}`, options);
    return response;
  } catch (error) {
    console.error('Error fetching foods by id: ', error);
    throw error;
  }
};

export {getAllFoods, getFoodsById};