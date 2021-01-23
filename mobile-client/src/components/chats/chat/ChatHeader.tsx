import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import config from 'react-native-config';
import { useSelector, useDispatch } from 'react-redux';
import RNCallKeep from 'react-native-callkeep';
import { RTCPeerConnection, mediaDevices } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';

import api from 'api';
import CustomText from 'components/CustomText';
import { Images } from 'assets';
import { Colors, Fonts } from 'variables';
import uuid from 'react-native-uuid';
import { callActions } from 'reduxStore/actions';

type ChatHeaderProps = {
  chatType: string;
  chatId: string | undefined;
  contactId: number;
  contactName: string;
  contactProfile: { small: string, medium: string };
};

const ChatHeader = ({ chatType, chatId, contactId, contactName, contactProfile }: ChatHeaderProps) => {
  const { typingContacts } = useSelector(state => state.chats);
  const { socketState } = useSelector(state => state.app);
  const { user: { _id: userId, username, avatar } } = useSelector(state => state.auth);
  const { call: {
    callId,
    isActive,
    isInitiatingCall,
    RTCConnection,
    localStream, 
    remoteStream,
    muted,
    cameraFacingMode,
  } } = useSelector(state => state.call);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/small`;

  const onStartCall = async (callType: string): Promise<void> => {

    await startCall(uuid.v4(), username, contactName, callType);
    
    // iOS Callkit doesn't provide a native UI outgoing call screen so we are using our own
    if (Platform.OS === 'ios') {
      navigation.navigate('Call');
    }
  };

  const startCall = async (
    callId: string, 
    callerName: string, 
    calleeName: string,
    callType: string
  ): Promise<void> => {

    const caller = {
      _id: userId,
      username,
      avatar: { small: avatar },
      online: true
    };
    const callee = {
      _id: contactId,
      username: contactName,
      avatar: { small: contactProfile.small },
      online: true
    };
    dispatch(callActions.initiateCall(callId, chatId, caller, callee, callType));

    if (Platform.OS === 'ios') {
      RNCallKeep.startCall(callId, callerName, calleeName, 'generic', callType === 'video' ? true : false);
    }
    if (Platform.OS === 'android') {
      RNCallKeep.startCall(callId, callerName, calleeName);
    }

    // Establish RTC Peer Connection
    const configuration = {iceServers: [
      {
        url: 'stun:stun.l.google.com:19302',  
      }, {
        url: 'stun:stun1.l.google.com:19302',    
      }, {
        url: 'stun:stun2.l.google.com:19302',    
      },
    ]};
    const peerConn = new RTCPeerConnection(configuration);
    dispatch(callActions.setRTCPeerConnection(peerConn));

    // Reattempt connection if unintentionally disconnected?
    peerConn.oniceconnectionstatechange = (event) => {
      console.log('Ice connection state: ' + event.target.iceConnectionState);
    };

    peerConn.onnegotiationneeded = (): void => {
      console.log('Negotiation needed');
    };

    peerConn.onaddstream = (event) => {
      try {
        if (event.stream && remoteStream !== event.stream) {
            dispatch(callActions.setRemoteStream(event.stream));
        }
      } catch (err) {
        console.error(`Error adding remote stream: ${err}`);
      }
    };

    // Add local stream to peer connection
    const stream = await startLocalStream();
    peerConn.addStream(stream);

    try {
      const data = { callId, chatId, caller, callee, callType };

      console.log(data)
      await api.post('/push-notifications/voip/send', data); 
    } catch (err) {
      console.error(err);
    }
  }; 

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
        }
      };
      const newStream = await mediaDevices.getUserMedia(constraints);
      dispatch(callActions.setLocalStream(newStream));

      return newStream;
    } catch (err) {
      console.log('Start local stream caller method error');
      console.log(err);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButton}>
            <MaterialCommunityIcon name="arrow-left" size={38} color={Colors.yellowDark} /> 
          </View>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {contactProfile ? (
            <Image 
              source={{ uri: `${S3_BUCKET_PATH}/${contactProfile}` }} 
              style={styles.image} 
            />
          ) : (
            <Image
              source={chatType === 'private' ? Images.avatarSmall : Images.avatarGroupSmall } 
              style={styles.image} />
          )}
        </View>
        <CustomText fontWeight={Fonts.semiBold}>
          {contactName}
          {typingContacts.includes(contactId) && ' is typing...'}
        </CustomText>
        <View style={styles.callButtons}>
          <TouchableOpacity onPress={() => onStartCall('audio')}>
            <View style={styles.audioBtn}>
              <MaterialIcon name="call" size={32} color={Colors.yellowDark} /> 
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onStartCall('video')}>
            <View style={styles.backButton}>
              <FontAwesomeIcon name="video-camera" size={28} color={Colors.yellowDark} /> 
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottom}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.yellowLight,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginBottom: -35
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20
  },
  bottom: {
    height: 60,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  backButton: {
    marginRight: 10
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 44, 
    height: 44, 
    borderRadius: 15, 
    backgroundColor: Colors.greyLight,
    marginRight: 10
  },
  image: {
    width: '100%', 
    height: '100%'
  },
  callButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto'
  },
  audioBtn: {
    marginRight: 8
  }
});

export default ChatHeader;

