import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';

import CustomText from 'components/CustomText';
import { Colors, Fonts, Headings } from 'variables';
import { videoCallActions } from 'reduxStore/actions';
import { emitRejectVideoCall, emitAcceptVideoCall } from 'socket/eventEmitters';

type IncomingCallNotificationProps = {};

const IncomingCallNotification = ({ }: IncomingCallNotificationProps) => {
  const { userId, socketState } = useSelector(state => state.auth);
  const { incomingCall: { callerId, callerName, offer } } = useSelector(state => state.video);
  const dispatch = useDispatch();
  const [RTCConnection, setRTCConnection] = useState(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',  
        }, {
          urls: 'stun:stun1.l.google.com:19302',    
        }, {
          urls: 'stun:stun2.l.google.com:19302',    
        }

      ],
    })
  );
  
  const onAcceptCall = async (): Promise<void> => {
    console.log(offer)
      try {
        await RTCConnection.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await RTCConnection.createAnswer();

        await RTCConnection.setLocalDescription(answer);

        const data = { callerId, recipientId: userId, answer };
        emitAcceptVideoCall(JSON.stringify(data), socketState)
      } catch (err) {
        console.log('Offerr Error', err);
      }
  };

  const onRejectCall = (): void => {
    dispatch(videoCallActions.receiveIncomingCall('', '', null));
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
    top: 45,
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
  }
});

export default IncomingCallNotification;
