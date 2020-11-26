import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as ContactsProvider } from './context/ContactsContext';
import { Provider as ChatsProvider } from './context/ChatsContext';
import { Provider as ProfileProvider } from './context/ProfileContext';
import Navigator from './navigation/Navigator';
import AppStateTracker from './components/AppStateTracker';
import SocketEventListeners from './socket/SocketEventListeners';
import SplashScreen from 'react-native-splash-screen'
import BackgroundTasksManager from './components/utility/BackgroundTasksManager';

declare const global: {HermesInternal: null | {}};

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <AuthProvider>
      <ChatsProvider>
        <ContactsProvider>
          <ProfileProvider>
            <AppStateTracker />
            <BackgroundTasksManager />
            <SocketEventListeners />
            <SafeAreaView style={styles.container}>
              <Navigator />
            </SafeAreaView>
          </ProfileProvider>
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
