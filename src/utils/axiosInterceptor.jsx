import axios from 'axios';
import { store } from "../Redux/Store"; 
import { logout } from '../Redux/AuthSlice';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
     
      toast.error('❌ Session expired. Please log in again.');

      store.dispatch(logout());

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;