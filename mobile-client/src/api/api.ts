import axios from 'axios';
import axiosRetry from 'axios-retry';
import AsyncStorage from '@react-native-community/async-storage';

const instance = axios.create({
  // baseURL: 'http://localhost:3006/api/' 
  baseURL: 'http://0e3d02fb79a2.ngrok.io/api/' 
});

axiosRetry(instance, { retries: 3 });

instance.interceptors.request.use(
  async (config) => {
    const user = async () => {
      try { 
        const jsonValue = await AsyncStorage.getItem('user');
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        console.log('Could not read user data from async storage inside axios interceptor: ' + e);
      }
    };

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`; 
    }
    return config;
  }, 
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
