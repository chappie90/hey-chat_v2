import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, 
  View, 
  AppState
} from 'react-native';

import Navigator from './navigation/Navigator';
import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as ContactsProvider } from './context/ContactsContext';
import SplashScreen from 'react-native-splash-screen'

declare const global: {HermesInternal: null | {}};

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
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
