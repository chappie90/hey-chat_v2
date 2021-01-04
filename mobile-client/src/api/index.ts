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
    try {
      const jsonValue = await AsyncStorage.getItem('user')
      const user = jsonValue !== null ? JSON.parse(jsonValue) : null;
  
      if (user && user.authToken) {
        config.headers.Authorization = `Bearer ${user.authToken}`; 
      } 
    } catch(err) {
      console.log('Could not read user data from async storage inside axios interceptor: ' + err);
    }

    return config;
  }, 
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
