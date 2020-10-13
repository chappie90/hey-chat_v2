import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';

import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as ContactsProvider } from './context/ContactsContext';
import { Provider as ChatsProvider } from './context/ChatsContext';
import Navigator from './navigation/Navigator';
import AppStateTracker from './components/AppStateTracker';
import SocketEventListeners from './socket/SocketEventListeners';
import SplashScreen from 'react-native-splash-screen'

declare const global: {HermesInternal: null | {}};

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <AuthProvider>
      <ChatsProvider>
        <ContactsProvider>
          <AppStateTracker />
          <SocketEventListeners />
          <SafeAreaView style={styles.container}>
            <Navigator />
          </SafeAreaView>
        </ContactsProvider>
      </ChatsProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
