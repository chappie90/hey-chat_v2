import axios from 'axios';
import axiosRetry from 'axios-retry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from 'react-native-config';

const instance = axios.create({
  baseURL: `${config.RN_API_BASE_URL}/api/` 
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
