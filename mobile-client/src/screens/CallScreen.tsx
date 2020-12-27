import React, { useState, useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';
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
import { Colors } from 'variables';
import { useSelector, useDispatch } from 'react-redux';
import InCallManager from 'react-native-incall-manager';
import { StackScreenProps } from '@react-navigation/stack';

import { emitMakeOutgoingVideoCall } from 'socket/eventEmitters';
import { videoCallActions } from 'reduxStore/actions';

type CallScreenProps = StackScreenProps<ChatsStackParams, 'Call'>;

const CallScreen = ({ route, navigation }: CallScreenProps) => {
  const { contactId, contactName } = route.params;
  const { userId, username, socketState } = useSelector(state => state.auth);
  const { RTCPeerConnection } = useSelector(state => state.video);
  const dispatch = useDispatch();
  const [calling, setCalling] = useState(false);
  const [localStream, setLocalStream] = useState({toURL: () => null});
  const [remoteStream, setRemoteStream] = useState({toURL: () => null});

  const [offer, setOffer] = useState(null);

  const [callToUsername, setCallToUsername] = useState(null);

  const onCallContact = () => {
    setCalling(true);

    // Create an offer
    RTCPeerConnection.createOffer().then((offer: any) => {
      RTCPeerConnection.setLocalDescription(offer).then(() => {
        // Check if contact online. Emit event if online, do some Push Kit magic if not?
        const data = { callerId: userId, callerName: username, recipientId: contactId, offer };
        emitMakeOutgoingVideoCall(JSON.stringify(data), socketState);
      });
    });
  };

  const createRTCPeerConnection = (): any => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun.l.google.com:19302'],  
        }, {
          urls: ['stun:stun1.l.google.com:19302'],    
        }, {
          urls: ['stun:stun2.l.google.com:19302'],    
        }

      ],
    });
  };

  useEffect(() => {
    dispatch(videoCallActions.setRTCPeerConnection(createRTCPeerConnection()));
  }, []);

  useEffect(() => {
    if (RTCPeerConnection) onCallContact();
  }, [RTCPeerConnection]);

  // useEffect(() => {
  //   if (socketState && userId) {
  //     try {
  //       InCallManager.start({media: 'audio'});
  //       InCallManager.setForceSpeakerphoneOn(true);
  //       InCallManager.setSpeakerphoneOn(true);
  //     } catch (err) {
  //       console.log('InApp Caller ---------------------->', err);
  //     }

  //     console.log(InCallManager);

  //     // send({
  //     //   type: 'login',
  //     //   name: userId,
  //     // });
  //   }
  // }, [socketState, userId]);

  return (
    <View style={styles.container}>
      <Text>
        {calling ? 'Calling' : 'Call'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 20
  }
});

export default CallScreen;

