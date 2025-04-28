import {fetchData} from '../utils/fetchData';

const foodApiUrl = import.meta.env.VITE_FOODS_API;

console.log('Food API URL:', foodApiUrl);

const getAllFoods = async () => {
  try {
    if (!foodApiUrl) {
      throw new Error('API URL is undefined. Check your environment variables.');
    }
    const response = await fetchData(foodApiUrl);
    console.log('Foods fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
};

export {getAllFoods};