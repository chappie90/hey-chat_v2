import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from 'reduxStore/reducers';
import Navigator from 'navigation/Navigator';
import AppStateManager from 'components/utility/AppStateManager';
import PushNotificationsManager from 'components/utility/PushNotificationsManager';
import SocketEventListeners from 'socket/EventListeners';
import BackgroundTasksManager from 'components/utility/BackgroundTasksManager';
import VoIPManager from 'components/utility/VoIPManager';
import { Colors } from 'variables';

declare const global: {HermesInternal: null | {}};

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  return (
    <Provider store={store}>
      <BackgroundTasksManager />
      <VoIPManager />
      <SocketEventListeners />
      <AppStateManager>
        <PushNotificationsManager>
          <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle='dark-content' />
            <Navigator />
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
