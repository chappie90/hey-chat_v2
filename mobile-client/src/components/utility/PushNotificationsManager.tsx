import React, { useEffect, useRef, useContext, ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Context as AuthContext } from 'context/AuthContext';
import api from 'api';

type PushNotificationsManagerProps = { children: ReactNode };

const PushNotificationsManager = ({ children }: PushNotificationsManagerProps) => {

  const configure = (): void => {
    PushNotification.configure({
      // User accepted notification permission - register token
      onRegister: async (tokenData): Promise<void> => {
        const { os: deviceOS, token: deviceToken } = tokenData;

        try {
          // If token is not in storage or new token has been issued send it to server
          const deviceStr = await AsyncStorage.getItem('deviceInfo');
          if (deviceStr !== null) {
            const deviceObj = JSON.parse(deviceStr);
            if (deviceObj.token === deviceToken) return;
          } 

          const data = { deviceOS, deviceToken };

          await AsyncStorage.setItem('deviceInfo', JSON.stringify(data));

          await api.post('/push-notifications/token/save', data);
        } catch (error) {
          console.log('Save device token method error');
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

  return <>{children}</>;
};

export default PushNotificationsManager;
