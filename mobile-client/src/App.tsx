import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import { Provider as AuthProvider } from 'context/AuthContext';
import { Provider as ContactsProvider } from 'context/ContactsContext';
import { Provider as ChatsProvider } from 'context/ChatsContext';
import { Provider as ProfileProvider } from 'context/ProfileContext';
import Navigator from 'navigation/Navigator';
import AppStateManager from 'components/utility/AppStateManager';
import PushNotificationsManager from 'components/utility/PushNotificationsManager';
import SocketEventListeners from 'socket/SocketEventListeners';
import SplashScreen from 'react-native-splash-screen'
import BackgroundTasksManager from 'components/utility/BackgroundTasksManager';

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
            <BackgroundTasksManager />
            <SocketEventListeners />
            <AppStateManager>
              <PushNotificationsManager>
                <SafeAreaView style={styles.container}>
                  <Navigator />
                </SafeAreaView>
              </PushNotificationsManager>
            </AppStateManager>
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
