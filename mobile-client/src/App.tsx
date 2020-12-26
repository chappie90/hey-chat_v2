import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from 'reduxStore/reducers';
import Navigator from 'navigation/Navigator';
import AppStateManager from 'components/utility/AppStateManager';
import PushNotificationsManager from 'components/utility/PushNotificationsManager';
import SocketEventListeners from 'socket/EventListeners';
import SplashScreen from 'react-native-splash-screen'
import BackgroundTasksManager from 'components/utility/BackgroundTasksManager';
import Notification from 'components/common/Notification';

declare const global: {HermesInternal: null | {}};

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <Provider store={store}>
      <BackgroundTasksManager />
      <SocketEventListeners />
      <AppStateManager>
        <PushNotificationsManager>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle='dark-content' />
            <Navigator />
            <Notification />
          </SafeAreaView>
        </PushNotificationsManager>
      </AppStateManager>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
