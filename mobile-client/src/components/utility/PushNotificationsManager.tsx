import React, { useEffect, useRef, useContext, ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";

import { Context as AuthContext } from 'context/AuthContext';

type PushNotificationsManagerProps = { children: ReactNode };

const PushNotificationsManager = ({ children }: PushNotificationsManagerProps) => {

  const configure = () => {
    PushNotification.configure({
      // user accepted notification permission - register token
      onRegister: function (tokenData) {
        const { token } = tokenData;

        console.log('registered token')
        console.log(token)
          
        // handle device token
        // send token to server...
        // store in AsyncStorage...
      },
      // notification received / opened in-app event
      onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // outlining what permissions to accept
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
