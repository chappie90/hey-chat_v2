import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { RTCSessionDescription, mediaDevices } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';

import CustomText from 'components/CustomText';
import { Colors, Fonts, Headings } from 'variables';
import { callActions } from 'reduxStore/actions';
import { emitRejectVideoCall, emitAcceptVideoCall, emitSendICECandidate } from 'socket/eventEmitters';
import { navigate } from 'navigation/NavigationRef';

type IncomingCallNotificationProps = {};

const IncomingCallNotification = ({ }: IncomingCallNotificationProps) => {
  const { socketState } = useSelector(state => state.app);
  const { userId, username, user: { avatar } } = useSelector(state => state.auth);
  const { 
    RTCConnection,
    incomingCall: { chatType, chatId, callerId, callerName, callerProfile, offer },
    activeCall: { remoteStream  }
  } = useSelector(state => state.call);
  const dispatch = useDispatch();

  const startLocalStream = async (): Promise<any> => {
    try {
      // isFront will determine if the initial camera should face user or environment
      const isFront = true;
      const devices = await mediaDevices.enumerateDevices();

      const facing = isFront ? 'front' : 'environment';
      const videoSourceId = devices.find((device: any) => device.kind === 'videoinput' && device.facing === facing);
      const facingMode = isFront ? 'user' : 'environment';
      const constraints: any = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode,
          optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      };

      const newStream = await mediaDevices.getUserMedia(constraints);

      dispatch(callActions.setLocalStream(newStream));

      return newStream;
    } catch (err) {
      console.log('Start local stream recipient method error');
      console.log(err);
    }
  };
  
  const onAcceptCall = async (): Promise<void> => {
    const stream = await startLocalStream();
    RTCConnection.addStream(stream);

    RTCConnection.onaddstream = (event: any) => {
      if (event.stream && remoteStream !== event.stream) {
        dispatch(callActions.setRemoteStream(event.stream));
      }
    };

    try {
      await RTCConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await RTCConnection.createAnswer();
      await RTCConnection.setLocalDescription(answer);

      const data = { 
        callerId, 
        recipientId: userId, 
        recipientName: username, 
        recipientProfile: avatar, 
        answer 
      };
      emitAcceptVideoCall(JSON.stringify(data), socketState);

      // Send candidates to caller
      RTCConnection.onicecandidate = (event: any) => {
        if (event.candidate) {
          const data = { userId, contactId: callerId, candidate: event.candidate };
          emitSendICECandidate(JSON.stringify(data), socketState);
        }
      };
      
    } catch (err) {
      console.log('Offer Error', err);
    }

    const routeParams = { 
      chatType, 
      chatId, 
      contactId: callerId, 
      contactName: callerName, 
      contactProfile: callerProfile 
    };

    dispatch(callActions.unsetIncomingCall());
    dispatch(callActions.setActiveCallStatus(true));

    InCallManager.start({media: 'audio/video'});

    navigate('VideoCall', routeParams);
  };

  const onRejectCall = (): void => {
    InCallManager.stopRingtone();
    InCallManager.stop();

    dispatch(callActions.unsetIncomingCall());

    const data = { callerId };
    emitRejectVideoCall(JSON.stringify(data), socketState);
  };

  if (!callerId) return <></>;

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <CustomText 
          color={Colors.white} 
          fontSize={Headings.headingMedium} 
          fontWeight={Fonts.semiBold}
          style={{ marginBottom: 6 }}
        >
          {callerName} is calling...
        </CustomText>
        <CustomText color={Colors.white} fontSize={Headings.headingExtraSmall}>
          Hey Chat Video Call
        </CustomText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onRejectCall}>
          <View style={styles.rejectButton}>
            <MaterialIcon color={Colors.purpleDark} name="close" size={28} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAcceptCall}>
          <View style={styles.acceptButton}>
          <MaterialIcon color={Colors.white} name="check" size={26} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.purpleDark,
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 25
  },
  actions: {
    flexDirection: 'row'
  },
  details: {

  },
  rejectButton: {
    backgroundColor: Colors.white,
    borderRadius: 40,
    width: 35,
    height: 35,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1
  },
  acceptButton: {
    backgroundColor: Colors.yellowDark,
    borderRadius: 40,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1
  },
  videoContainer: {
    flex: 1
  }
});

export default IncomingCallNotification;
