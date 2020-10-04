import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, 
  View, 
  AppState
} from 'react-native';

import Navigator from './navigation/Navigator';
import { socket } from './socket/socket';
import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as ContactsProvider } from './context/ContactsContext';
import SplashScreen from 'react-native-splash-screen'

declare const global: {HermesInternal: null | {}};

// Socket connection
socket.on('connect', () => {
  console.log('socket connected');
});

socket.on('disconnect', () => {
  console.log('socket disconnected');
});

const App = () => {
  const appState = useRef<string>(AppState.currentState);

  const handleAppStateChange = (nextAppState: string) => {
    if (
      appState.current.match(/inactive|background/) && 
      nextAppState === 'active'
    ) {
      console.log('App has come to foreground');
    }

    appState.current = nextAppState;
    console.log('App state: ' + appState.current);
  };

  useEffect(() => {
    SplashScreen.hide();

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [])

  return (
    <AuthProvider>
      <ContactsProvider>
        <View style={styles.container}>
          <Navigator />
        </View>
      </ContactsProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
