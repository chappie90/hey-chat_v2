import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { store, persistor } from 'reduxStore';
import Navigator from 'navigation/Navigator';
import AppStateManager from 'components/utility/AppStateManager';
import PushNotificationsManager from 'components/utility/PushNotificationsManager';
import SocketEventListeners from 'socket/EventListeners';
import BackgroundTasksManager from 'components/utility/BackgroundTasksManager';
import { Colors } from 'variables';

declare const global: {HermesInternal: null | {}};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BackgroundTasksManager />
        <SocketEventListeners />
        <AppStateManager>
          <PushNotificationsManager>
            <SafeAreaView style={styles.container}>
              <StatusBar backgroundColor={Colors.white} barStyle='dark-content' />
              <Navigator />
            </SafeAreaView>
          </PushNotificationsManager>
        </AppStateManager>
        </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
