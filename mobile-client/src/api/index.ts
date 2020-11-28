import axios from 'axios';
import axiosRetry from 'axios-retry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const instance = axios.create({
  baseURL: `${Config.RN_API_BASE_URL}/api/` 
  // baseURL: 'http://a37abb4bf87e.ngrok.io/api/' 
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
