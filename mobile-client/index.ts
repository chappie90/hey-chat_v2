/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { store } from 'reduxStore';
import { appActions } from 'reduxStore/actions';
import { connectToSocket } from 'socket/connection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCallKeep from 'react-native-callkeep';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
  // Make your call here
  console.log('background service running');
  console.log(name + ', ' + callUUID + ', ' + handle);

  // Reconnect to socket
  (async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user')
      const user = jsonValue !== null ? JSON.parse(jsonValue) : null;

      if (user) {
        const socket = connectToSocket(user._id);
        store.dispatch(appActions.setSocketState(socket));
      }
    } catch(err) {
      console.log('Could not read user data from async storage inside voip switch: ' + err);
    }
  })();

  RNCallKeep.registerAndroidEvents();

  return Promise.resolve();
});