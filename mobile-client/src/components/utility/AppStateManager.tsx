import React, { useEffect, useRef, ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { connectToSocket } from 'socket/connection';
import { authActions, chatsActions } from 'reduxStore/actions';
import { emitStopTyping } from 'socket/eventEmitters';

type AppStateManagerProps = { children: ReactNode };

const AppStateManager = ({ children }: AppStateManagerProps) => {
  const { userId, token, socketState } = useSelector(state => state.auth);
  const { activeContactId } = useSelector(state => state.chats);
  const dispatch = useDispatch();
  const appState = useRef<string>(AppState.currentState);
  const socket = useRef<any>(null);
  const activeContactIdRef = useRef('');

  const createSocketConnection = (): void => {
    if (token && userId) {
      socket.current = connectToSocket(userId);
      dispatch(authActions.setSocketState(socket.current));
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
    dispatch(authActions.setSocketState(null));
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
        // Handle typing logic if either user leaves app before typing timeout has expired
        const data = { senderId: userId, recipientId: activeContactIdRef.current };
        emitStopTyping(JSON.stringify(data), socket.current);
        dispatch(chatsActions.resetTypingContacts());

        destroySocketConnection(); 
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    if (token) {
      createSocketConnection();
      AppState.addEventListener('change', handleAppStateChange);
    } else {
      AppState.removeEventListener('change', handleAppStateChange);
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

  useEffect(() => {
    activeContactIdRef.current = activeContactId;
  }, [activeContactId]);

  return <>{children}</>;
};

export default AppStateManager;
