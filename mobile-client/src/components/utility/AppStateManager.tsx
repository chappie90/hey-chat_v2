import React, { useEffect, useRef, ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PushNotification from "react-native-push-notification";

import { connectToSocket } from 'socket/connection';
import { appActions, chatsActions, contactsActions } from 'reduxStore/actions';
import { emitStopTyping, emitMarkAllMessagesAsRead } from 'socket/eventEmitters';
import { store } from 'reduxStore';

type AppStateManagerProps = { children: ReactNode };

const AppStateManager = ({ children }: AppStateManagerProps) => {
  const { user: { _id: userId, username, authToken } } = useSelector(state => state.auth);
  const { socketState, currentScreen, userConnected } = useSelector(state => state.app);
  const { chats, chatHistory, activeChat } = useSelector(state => state.chats);
  const dispatch = useDispatch();
  const appState = useRef<string>(AppState.currentState);
  const socket = useRef<any>(null);
  const activeChatRef = useRef<TChat | null>(null);
  const currentScreenRef = useRef('');
  const chatsRef = useRef<TChat[] | []>([]);

  const createSocketConnection = (): void => {
    if (authToken && userId) {
      socket.current = connectToSocket(userId);
      dispatch(appActions.setSocketState(socket.current));
    }   
  }; 

  const destroySocketConnection = (): void => {
    socket.current.disconnect();
    dispatch(appActions.setSocketState(null));
  };

  // Clear badge count
  const resetBadgeCount = (): void => {
    PushNotification.setApplicationIconBadgeNumber(0);
    dispatch(appActions.setBadgeCount(0));
  };

  const handleAppStateChange = (nextAppState: string) => {
    if (
      appState.current.match(/inactive|background/) && 
      nextAppState === 'active'
    ) {
      createSocketConnection();
      resetBadgeCount();

      // If app becomes active on CurrentChat screen mark recipient's chat as read
      if (activeChatRef.current && currentScreenRef.current === 'CurrentChat') {
        dispatch(chatsActions.markMessagesAsReadRecipient(activeChatRef.current.chatId));
      }
    }

    // Destroy socket instance on app in background
    if (nextAppState === 'background') {
      if (socket.current) {
        // Handle typing logic if either user leaves app before typing timeout has expired
        if (activeChatRef.current) {
          const recipientId = activeChatRef.current.participants.filter(contact => contact._id !== userId)[0]._id;
          const data = { senderId: userId, recipientId };
          
          emitStopTyping(JSON.stringify(data), socket.current);
          dispatch(chatsActions.resetTypingContacts());
        }

        destroySocketConnection(); 
        dispatch(appActions.setUserConnectionState(false));
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    if (authToken) {
      // When app killed and first load 
      createSocketConnection();
      resetBadgeCount();

      AppState.addEventListener('change', handleAppStateChange);
    } else {
      AppState.removeEventListener('change', handleAppStateChange);
    }
   
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [authToken]);

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
    if (userConnected) {
      // If app becomes active on CurrentChat screen send signal to sender message has been read
      if (activeChatRef.current && currentScreenRef.current === 'CurrentChat' && socketState) {
        const senderId = activeChatRef.current.participants.filter(contact => contact._id !== userId)[0]._id;
        const eventData = { chatId: activeChatRef.current.chatId, senderId };
        emitMarkAllMessagesAsRead(JSON.stringify(eventData), socketState);
      }
    }
  }, [userConnected]);

  useEffect(() => {
    activeChatRef.current = activeChat;
    currentScreenRef.current = currentScreen;
    chatsRef.current = chats;
  }, [activeChat, currentScreen, chats]);

  return <>{children}</>;
};

export default AppStateManager;
