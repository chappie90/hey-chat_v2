import React, { useEffect } from 'react'
import { PermissionsAndroid, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';

const VoIPManager = ({ }) => {

  const initRNCallKeep = async (): Promise<void> => {
    const options = {
      ios: {
        appName: 'Hey',
        imageName: 'sim_icon',
        supportsVideo: false,
        maximumCallGroups: '1',
        maximumCallsPerCallGroup: '1'
      },
      android: {
        alertTitle: 'Permissions Required',
        alertDescription:
          'This application needs to access your phone calling accounts to make calls',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'sim_icon',
        additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS]
      }
    };

    try {
      await RNCallKeep.setup(options);

      if (Platform.OS === 'android') RNCallKeep.setAvailable(true);
    } catch (err) {
      console.error('Initialize CallKeep method error:', err.message);
    }
  };

  const onDidReceiveStartCall = () => {
    console.log('did start call')
  };

  const onAnswerCall = () => {

  };

  const onEndCall = () => {

  };
  
  const onIncomingCallDisplayed = () => {

  };

  const onToggleMute = () => {

  };

  const onToggleHold = () => {

  };

  const onAudioSessionActivated = () => {

  };

  const onDTMF = () => {

  };

  useEffect(() => {
    (async () => {
      await initRNCallKeep();
    })();
  
    RNCallKeep.addEventListener('didReceiveStartCallAction', onDidReceiveStartCall);
    RNCallKeep.addEventListener('answerCall', onAnswerCall);
    RNCallKeep.addEventListener('endCall', onEndCall);
    RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
    RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
    RNCallKeep.addEventListener('didToggleHoldCallAction', onToggleHold);
    RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);
    RNCallKeep.addEventListener('didActivateAudioSession', onAudioSessionActivated);
  }, []);

  return <></>;
};

export default VoIPManager;

