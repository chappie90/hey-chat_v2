import React, { useEffect } from 'react'
import BackgroundFetch from 'react-native-background-fetch';

const BackgroundTasksManager = () => {

  useEffect(() => {
    BackgroundFetch.configure({
      minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
      // Android options
      forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
      requiresCharging: false,      // Default
      requiresDeviceIdle: false,    // Default
      requiresBatteryNotLow: false, // Default
      requiresStorageNotLow: false  // Default
    }, async (taskId) => {
      console.log("[js] Received background-fetch event: ", taskId);

      // Potential way to process tasks is to save them with async storage while app
      // in foreground and send the list to a server to process
      // clear finished items from the list
      // const tasks = await AsyncStorage.getItem('tasks');
      // axios.post('/process')
      // AsyncStorage.setItem('tasks', '');

      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
    });

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });
  }, []);

  return <></>;
};

export default BackgroundTasksManager;

// or this 
// export const backgroundFetchStatus = () =>
//   new Promise((resolve) => {
//     BackgroundFetch.status((status) => {
//       resolve(status);
//     })
//   });
