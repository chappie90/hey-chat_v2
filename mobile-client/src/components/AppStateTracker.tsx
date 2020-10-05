import React, { useEffect, useRef, useContext } from 'react';
import { AppState, Platform } from 'react-native';

import { connectToSocket } from '../socket/socketConnection';
import { Context as AuthContext } from '../context/AuthContext';

const AppStateTracker = () => {
  const { state: { userId, token, socketState }, setSocketState } = useContext(AuthContext);
  const appState = useRef<string>(AppState.currentState);
  const socket = useRef<any>(null);

  const createSocketConnection = (): void => {
    if (token && userId) {
      socket.current = connectToSocket(userId);
      setSocketState(socket.current);
    //   // if (Platform.OS === 'ios') {
    //   //   await Notifications.setBadgeNumberAsync(0);
    //   // }
    //   // if (Platform.OS === 'android') {
    //   //   await Notifications.dismissAllNotificationsAsync();
    //   // }
    //   // resetBadgeCount(username);
    }   
  }; 

  const destroySocketConnection = (): void => {
    socket.current.disconnect();
    setSocketState(null);
  };

  const handleAppStateChange = (nextAppState: string) => {
    // Connect to socket on app active
    if (
      appState.current.match(/inactive|background/) && 
      nextAppState === 'active'
    ) {
      createSocketConnection();
    }

    // Destroy socket instance on app in background
    if (nextAppState === 'background') {
      if (socket.current) {
        destroySocketConnection(); 
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    if (token) {
      createSocketConnection();
      AppState.addEventListener('change', handleAppStateChange);
    }
   
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [token]);

  useEffect(() => {
    // Check socket connection
    if (socketState) {
      socketState.on('connect', () => {
        console.log('socket connected');
      });

      socketState.on('disconnect', () => {
        console.log('socket disconnected');
      });
    }
  }, [socketState]);

  return <></>;
};

export default AppStateTracker;
