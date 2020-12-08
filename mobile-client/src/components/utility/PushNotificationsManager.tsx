import React, { useEffect, useRef, useState, useContext, ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

import api from 'api';
import actions from 'reduxStore/actions';

type PushNotificationsManagerProps = { children: ReactNode };

const PushNotificationsManager = ({ children }: PushNotificationsManagerProps) => {
  const { userId } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const configure = (): void => {
    PushNotification.configure({
      // User accepted notification permission - register token
      onRegister: async (tokenData): Promise<void> => {
        // Save to storage to send to server when user id is available from store
        try {
          await AsyncStorage.setItem('deviceInfo', JSON.stringify(tokenData));
        } catch (error) {
          console.log('Save device info to async storage method error');
          if (error.response) console.log(error.response.data.message);
          if (error.message) console.log(error.message);
        }
      },
      // Notification received / opened in-app event
      onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Outlining what permissions to accept
      permissions: {
        alert: true,
        badge: true,
        sound: true
      }
    });
  };

  useEffect(() => {
    configure();
  }, []);

  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          // Send token to server
          const deviceStr = await AsyncStorage.getItem('deviceInfo');
          if (deviceStr !== null) {
            const { os: deviceOS, token: deviceToken } = JSON.parse(deviceStr);
        
            const data = { userId, deviceOS, deviceToken };
    
            await AsyncStorage.setItem('deviceInfo', JSON.stringify(data));
      
            await api.post('/push-notifications/token/save', data);
          } 
        } catch (error) {
          console.log('Save device token method error');
          if (error.response) console.log(error.response.data.message);
          if (error.message) console.log(error.message);
        }
      })();
    }
  }, [userId]);

  return <>{children}</>;
};

export default PushNotificationsManager;
