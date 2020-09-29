import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import io from 'socket.io-client';

import Navigator from './navigation/Navigator';
import { Provider as AuthProvider } from './context/AuthContext';
import SplashScreen from 'react-native-splash-screen'

declare const global: {HermesInternal: null | {}};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    const socket = io('http://localhost:3006');
    socket.on('message', (message: string) => {
      console.log(message);
    });
  }, [])

  return (
    <AuthProvider>
      <View style={styles.container}>
        <Navigator />
      </View>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
