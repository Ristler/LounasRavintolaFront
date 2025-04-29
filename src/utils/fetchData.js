const fetchData = async (url, options = {}) => {
  try {
    console.log('Fetching data from URL:', url);
    const response = await fetch(url, options);
    
    // Check if response is JSON by looking at Content-Type header
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON. Content-Type:', contentType);
      const text = await response.text();
      console.error('Response text (first 100 chars):', text.substring(0, 100));
      throw new Error('Server did not return JSON data');
    }
    
    const json = await response.json();
    
    if (!response.ok) {
      if (json.message) {
        throw new Error(json.message);
      }
      throw new Error(`Error ${response.status} occurred`);
    }
    
    return json;
  } catch (error) {
    console.error('Fetch error details:', error);
    throw error;
  }
};

export {fetchData};