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
import config from 'react-native-config';
import Draggable from 'react-native-draggable';
import RNCallKeep from 'react-native-callkeep';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { callActions } from 'reduxStore/actions';
import CustomText from 'components/CustomText';
import VideoCallActions from 'components/video/VideoCallActions';
import CustomButton from 'components/common/CustomButton';

type CallScreenProps = StackScreenProps<ChatsStackParams, 'VideoCall'>;

const CallScreen = ({ route, navigation }: CallScreenProps) => {
  const { socketState } = useSelector(state => state.app);
  const { user: { _id: userId, username, avatar } } = useSelector(state => state.auth);
  const { call: {
    callId,
    chat: { chatType, chatId },
    caller,
    callee,
    isActive,
    isInitiatingCall,
    RTCConnection,
    localStream, 
    remoteStream,
    muted,
    localVideoEnabled,
    remoteVideoEnabled,
    cameraFacingMode,
  } } = useSelector(state => state.call);
  const dispatch = useDispatch();
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/small`;
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const endCall = (): void => {
    RNCallKeep.endCall(callId);

    navigation.navigate('CurrentChat', { 
      chatType, 
      chatId, 
      contactId: callee._id, 
      contactName: callee.username, 
      contactProfile: callee.avatar.small 
    });
  };

  const toggleVideoMode = (): void => {
    localStream.getTracks().forEach((track: any) => {
      if (track.kind === 'video')  {
        track.enabled = !localVideoEnabled;
      }
    } );
    dispatch(callActions.toggleVideoMode());
  };

  const toggleCameraFacingMode = (): void => {
    localStream.getVideoTracks()[0]._switchCamera();
  };

  const toggleMuteMicrophone = (): void => {
    // RNCallKeep.setMutedCall(uuid, true); // try it
    localStream.getTracks().forEach((track: any) => {
      if (track.kind === 'audio')  {
        track.enabled = muted;
        dispatch(callActions.toggleMuteCall());
      }
    } );
  };

  return (
    <View style={styles.container}>
      {remoteStream &&
        <RTCView streamURL={remoteStream.toURL()} style={styles.remoteStream} objectFit="cover" />
      }
      <View style={styles.calleeName}>
        <CustomText color={Colors.purpleDark} fontSize={Headings.headingExtraLarge}>
          {callee.username}
        </CustomText>
      </View>
      <CustomButton 
        layout={styles.actionBtn}
        activeOpacity={1}
        onPress={toggleVideoMode}
      >
        <Ionicon name="camera-reverse" size={50} color={Colors.white} /> 
      </CustomButton>
      {localStream && localVideoEnabled &&
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
          <View style={remoteStream ?
           styles.partialLocalStreamContainer :
           styles.fullLocalStreamContainer
          }>
            <RTCView streamURL={localStream.toURL()} style={styles.localStream} objectFit="cover" />
          </View>
        </Draggable>
      }
      <VideoCallActions 
        muted={muted}
        videoEnabled={localVideoEnabled}
        onToggleCameraFacingMode={toggleCameraFacingMode}
        onEndCall={endCall}
        onToggleMuteMicrophone={toggleMuteMicrophone}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  remoteStream: {
    flex: 1,
    zIndex: -2
  }, 
  calleeName: {
    position:'absolute', 
    top: 40, 
    alignSelf: 'center', 
    zIndex: -1
  },
  actionBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: -1
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
});

export default CallScreen;

