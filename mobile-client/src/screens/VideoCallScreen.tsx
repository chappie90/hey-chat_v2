import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, useWindowDimensions } from 'react-native';
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

import { 
  emitMakeVideoCallOffer, 
  emitSendICECandidate, 
  emitCancelVideoCall,
  emitEndVideoCall
} from 'socket/eventEmitters';
import { videoCallActions } from 'reduxStore/actions';
import CustomButton from 'components/common/CustomButton';
import CustomText from 'components/CustomText';
import { Images } from 'assets';

type CallScreenProps = StackScreenProps<ChatsStackParams, 'VideoCall'>;

const CallScreen = ({ route, navigation }: CallScreenProps) => {
  const { chatType, chatId, contactId, contactName, contactProfile } = route.params;
  const { socketState } = useSelector(state => state.app);
  const { userId, username } = useSelector(state => state.auth);
  const { profileImage } = useSelector(state => state.profile);
  const { 
    RTCConnection, 
    localStream, 
    activeCall: { status: isCallActive, muted, cameraFacingMode, remoteStream } 
  } = useSelector(state => state.video);
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
      dispatch(videoCallActions.setLocalStream(newStream));

      return newStream;
    } catch (err) {
      console.log('Start local stream caller method error');
      console.log(err);
    }
  };

  const startCall = async (): Promise<void> => {
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
    dispatch(videoCallActions.setRTCPeerConnection(peerConn));

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
            dispatch(videoCallActions.setRemoteStream(event.stream));
        }
      } catch (err) {
        console.error(`Error adding remote stream: ${err}`);
      }
    };

    const stream = await startLocalStream();
    peerConn.addStream(stream);

    try {
      const offer = await peerConn.createOffer();

      await peerConn.setLocalDescription(offer);

      const data = { 
        chatType,
        chatId,
        callerId: userId, 
        callerName: username, 
        callerProfile: profileImage,
        recipientId: contactId, 
        offer 
      };
      emitMakeVideoCallOffer(JSON.stringify(data), socketState);
    } catch (err) {
      console.error(err);
    }

    InCallManager.start({media: 'audio', ringback: '_DEFAULT_'});
  };

  const stopLocalStream = () => {
    localStream.getTracks().forEach((t: any) => t.stop());
    localStream.release();
    dispatch(videoCallActions.setLocalStream(null));
  };

  const onEndCall = (): void => {
    InCallManager.stop();

    stopLocalStream();

    // Close Peer connection and clean up event listeners
    RTCConnection.close(); 
    // RTCConnection.onicecandidate = null; 
    // RTCConnection.onaddstream = null; 
    
    dispatch(videoCallActions.setRTCPeerConnection(null));

    if (isCallActive) {
      dispatch(videoCallActions.setRemoteStream(null));
      const data = { 
        chatType, 
        chatId, 
        senderId: userId, 
        senderName: username,
        senderProfile: profileImage,
        recipientId: contactId
      };
      console.log('end')
      console.log(data)
      emitEndVideoCall(JSON.stringify(data), socketState);
    } else {
      const data = { recipientId: contactId };
      emitCancelVideoCall(JSON.stringify(data), socketState);
    }

    navigation.navigate('CurrentChat', { chatType, chatId, contactId, contactName, contactProfile });
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
    setMuteMic(!muteMic);
   };

  useEffect(() => {
    if (!isCallActive) {
      startCall();
    }
  }, []);

  useEffect(() => {
    // console.log('remote stream caller')
    // console.log(remoteStream)
    // console.log('local stream caller')
    // console.log(localStream)
  }, [remoteStream, localStream])

  return (
    <View style={styles.container}>
      {remoteStream &&
        <RTCView streamURL={remoteStream.toURL()} style={styles.remoteStream} objectFit="cover" />
      }
      {remoteStream &&
        <View style={{ position:'absolute', bottom: 100, alignSelf: 'center', zIndex: 10 }}>
          <CustomText color={Colors.purpleDark} fontSize={Headings.headingExtraLarge}>
            {contactName}
          </CustomText>
        </View>
      }
     {localStream && 
      <Draggable 
        x={windowWidth - 150} 
        y={20} 
        touchableOpacityProps={{ activeOpacity: 1 }}
        minX={20}
        minY={20}
        maxX={windowWidth - 20}
        maxY={windowHeight - 40}
        onShortPressRelease={()=> console.log('touched!!')}
      >
        <View 
          style={remoteStream ?
            styles.partialLocalStreamContainer :
            styles.fullLocalStreamContainer
          }
        >
          <RTCView streamURL={localStream.toURL()} style={styles.localStream} objectFit="cover" />
        </View>
      </Draggable>
      }
      {remoteStream && 
        <View style={styles.actions}>
          <CustomButton layout={styles.actionBtnLayout} onPress={toggleCameraFacingMode}>
            <Ionicon name="camera-reverse" size={50} color={Colors.red} /> 
          </CustomButton>
          <CustomButton layout={styles.actionBtnLayout} onPress={onEndCall}>
            <MaterialCommunityIcon name="phone-hangup" size={50} color={Colors.red} /> 
          </CustomButton>
          <CustomButton layout={styles.actionBtnLayout} onPress={toggleCameraFacingMode1}>
            <Ionicon name="camera-reverse" size={50} color={Colors.red} /> 
          </CustomButton>
          <CustomButton layout={styles.actionBtnLayout} onPress={toggleMuteMicrophone}>
            <FontAwesomeIcon 
              name={muteMic ? "microphone-slash" : "microphone"} 
              size={50} 
              color={Colors.red} 
            /> 
          </CustomButton>
        </View>
      }
      {localStream && !remoteStream &&
        <>
          <View style={styles.videoDetailsBackground} />
          <View style={styles.videoDetails}>
            <View style={styles.imageContainer}>
              {contactProfile ? (
                <Image 
                  source={{ uri: `${S3_BUCKET_PATH}/${contactProfile}` }} 
                  style={styles.image} 
                />
              ) : (
                <Image
                  source={Images.avatarSmall} 
                  style={styles.image} />
              )}
            </View>
            <CustomText color={Colors.purpleDark} fontSize={Headings.headingExtraLarge}>{contactName}</CustomText>
            <CustomText color={Colors.purpleDark}  fontSize={Headings.headingSmall}>Ringing...</CustomText>
            <CustomButton layout={styles.endCallButtonLayout} onPress={onEndCall}>
              <MaterialCommunityIcon name="phone-hangup" size={50} color={Colors.red} /> 
            </CustomButton>
          </View>
        </>
      }
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
    flex: 1
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
  videoDetailsBackground: {
    width: 250,
    height: 260,
    opacity: 0.8,
    backgroundColor: Colors.purpleLight,
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 25,
    position: 'absolute',
    alignSelf: 'center',
    top: '17%',
    alignItems: 'center',
    zIndex: 1
  },  
  videoDetails: { 
    position: 'absolute',
    alignSelf: 'center',
    top: '20%',
    alignItems: 'center',
    zIndex: 2
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 100, 
    height: 100, 
    borderRadius: 15, 
    backgroundColor: Colors.greyLight
  },
  image: {
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
    zIndex: -1
  },
  actionBtnLayout: {

  }
});

export default CallScreen;

