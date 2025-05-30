import axios from 'axios';
// import paths from 'routes/paths';

const client = async (url, method, body) => {
  try {
    const headers = {
      accept: '*/*',
      'content-type':
        body instanceof FormData ? 'multipart/form-data' : 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Cache-Control': 'no-store',
      Pragma: 'no-cache'
    };

    const config = {
      url: `${import.meta.env.VITE_LOCAL_URL}/${url}`,

      method: method,
      headers: headers,
      data: body
    };

    const response = await axios(config);

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = `${
        paths.cardLogin
      }?cacheBust=${new Date().getTime()}`;
    } else {
      return {
        data: response.data,
        statusCode: response.status,
        message: response.data.message
      };
    }
  } catch (error) {
    console.error('API call failed:', error.message);
    return {
      message: error.response?.data?.message,
      statusCode: error.response?.status || 500
    };
  }
};

export default client;
