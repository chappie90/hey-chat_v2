import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, 
  View, 
  Image, 
  useWindowDimensions,
  Platform
} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
} from 'react-native-webrtc';
import { Colors, Headings } from 'variables';
import { useSelector, useDispatch } from 'react-redux';
import InCallManager from 'react-native-incall-manager';
import { StackScreenProps } from '@react-navigation/stack';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import config from 'react-native-config';
import Draggable from 'react-native-draggable';
import RNCallKeep from 'react-native-callkeep';

import { callActions } from 'reduxStore/actions';
import CustomButton from 'components/common/CustomButton';

type CallScreenProps = StackScreenProps<ChatsStackParams, 'VideoCall'>;

const CallScreen = ({ route, navigation }: CallScreenProps) => {
  const { chatType, chatId, contactId, contactName, contactProfile } = route.params;
  const { socketState } = useSelector(state => state.app);
  const { user: { _id: userId, username, avatar } } = useSelector(state => state.auth);
  const { call: {
    callId,
    caller,
    callee,
    isActive,
    isInitiatingCall,
    RTCConnection,
    localStream, 
    remoteStream,
    muted,
    cameraFacingMode,
  } } = useSelector(state => state.call);
  const dispatch = useDispatch();
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/small`;
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

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

  const stopLocalStream = () => {
    localStream.getTracks().forEach((t: any) => t.stop());
    localStream.release();
    dispatch(callActions.setLocalStream(null));
  };

  const onEndCallOld = (): void => {
    console.log('on end call video screen')
    RNCallKeep.endCall(callId);

    console.log(callee)

    navigation.navigate('CurrentChat', { 
      chatType, 
      chatId, 
      contactId: callee._id, 
      contactName: callee.username, 
      contactProfile: callee.avatar.small 
    });
  };

  const toggleCameraFacingMode = async (): Promise<void> => {
    localStream.getVideoTracks()[0]._switchCamera();
  };

  const toggleCameraFacingMode1 = async (): Promise<void> => {
 
   };

   const toggleMuteMicrophone = async (): Promise<void> => {
    localStream.getTracks().forEach((track: any) => {
      if (track.kind === 'audio')  {
        track.enabled = !muteMic
      }
    } );
    // setMuteMic(!muteMic);
   };

  const startCall = async (
    callId: string, 
    callerName: string, 
    calleeName: string,
    callType: string
  ): Promise<void> => {
    RNCallKeep.startCall(callId, callerName, calleeName);

    const caller = {
      _id: userId,
      username,
      avatar: { small: avatar },
      online: true
    };

    const callee = {
      _id: contactId,
      username: contactName,
      avatar: { small: contactProfile ? contactProfile : '' },
      online: true
    };

    dispatch(callActions.initiateCall(callId, chatId, caller, callee, callType));

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

    // Start ringback tone
    InCallManager.start({media: 'audio', ringback: '_DEFAULT_'});
  };  

  useEffect(() => {
    (async () => {
      if (!RTCConnection)  {
        // startCall(uuid.v4(), username, contactName, 'video');
      }
    })();
  }, []);

  useEffect(() => {

  }, [localStream])

  return (
    <View style={styles.container}>
      {/* {remoteStream &&
        <RTCView streamURL={remoteStream.toURL()} style={styles.remoteStream} objectFit="cover" />
      }
      {remoteStream &&
        <View style={{ position:'absolute', bottom: 100, alignSelf: 'center', zIndex: 10 }}>
          <CustomText color={Colors.purpleDark} fontSize={Headings.headingExtraLarge}>
            {contactName}
          </CustomText>
        </View>
      } */}
     {localStream && 
      // <Draggable 
      //   x={windowWidth - 150} 
      //   y={20} 
      //   touchableOpacityProps={{ activeOpacity: 1 }}
      //   minX={20}
      //   minY={20}
      //   maxX={windowWidth - 20}
      //   maxY={windowHeight - 40}
      //   onShortPressRelease={()=> console.log('touched!!')}
      // >
        <View 
          style={remoteStream ?
            styles.partialLocalStreamContainer :
            styles.fullLocalStreamContainer
          }
        >
           <View style={styles.actions}>
          <CustomButton layout={styles.actionBtnLayout} onPress={toggleCameraFacingMode}>
            <Ionicon name="camera-reverse" size={50} color={Colors.red} /> 
          </CustomButton>
          <CustomButton layout={styles.actionBtnLayout} onPress={onEndCallOld}>
            <MaterialCommunityIcon name="phone-hangup" size={50} color={Colors.red} /> 
          </CustomButton>
          <CustomButton layout={styles.actionBtnLayout} onPress={toggleCameraFacingMode1}>
            <Ionicon name="camera-reverse" size={50} color={Colors.red} /> 
          </CustomButton>
          <CustomButton layout={styles.actionBtnLayout} onPress={toggleMuteMicrophone}>
            <FontAwesomeIcon 
              name={true ? "microphone-slash" : "microphone"} 
              size={50} 
              color={Colors.red} 
            /> 
          </CustomButton>
        </View>
          <RTCView streamURL={localStream.toURL()} style={styles.localStream} objectFit="cover" />
        </View>
      // </Draggable>
      }
      {/* {remoteStream &&  */}
       
      {/* } */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1
  },
  remoteStream: {
    flex: 1,
    zIndex: -2
  }, 
  fullLocalStreamContainer: {
    flex: 1,
    backgroundColor: 'blue'
  },
  partialLocalStreamContainer: {
    width: 140,
    height: 190,
    borderRadius: 25,
    overflow: 'hidden',
  },
  localStream: {
    width: '100%',
    height: '100%'
  },   
  endCallButtonLayout: {
    marginTop: 20
  },
  actions: {
    position: 'absolute',
    bottom: 30,
    left: 20, 
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 2
  },
  actionBtnLayout: {

  }
});

export default CallScreen;

