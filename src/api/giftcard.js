import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_STRAPI_URL;

// Auth API calls
export const loginUser = async (identifier, password) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/local`, {
    identifier,
    password
  });
  return response.data;
};

// Gift card API calls
export const checkBalance = async (pan, cvv) => {
  const response = await axios.post(`${API_BASE_URL}/api/balance/check`, {
    pan,
    cvv,
    expDate: '01/50'
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const registerPayment = async (pan, cvv, amount) => {
  const response = await axios.post(`${API_BASE_URL}/api/transactions/register-payment`, {
    pan,
    cvv,
    amount: Number(amount),
    userId: localStorage.getItem('userId')
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getTransactions = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
    params: {
      userId: localStorage.getItem('userId'),
      sort: 'Date:desc',
      limit: 10
    },
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};