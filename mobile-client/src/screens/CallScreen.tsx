import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, 
  View, 
  Image,
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
import RNCallKeep from 'react-native-callkeep';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { callActions } from 'reduxStore/actions';
import AudioCallUI from 'components/call/AudioCallUI';
import VideoCallUI from 'components/call/VideoCallUI';

type CallScreenProps = StackScreenProps<ChatsStackParams, 'Call'>;

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
    type,
    speaker,
    muted,
    localVideoEnabled,
    remoteVideoEnabled,
    cameraFacingMode,
  } } = useSelector(state => state.call);
  const dispatch = useDispatch();
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/small`;

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

  const toggleSpeaker = (): void => {
    InCallManager.setForceSpeakerphoneOn(!speaker);
    dispatch(callActions.toggleSpeaker());
  };

  const toggleVideo = (): void => {
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
      <AudioCallUI 
        show={!localVideoEnabled && !remoteVideoEnabled} 
        contactAvatar={callee.avatar.medium}
        callee={callee} 
        isInitiatingCall={isInitiatingCall}
        speaker={speaker}
        muted={muted}
        localVideoEnabled={localVideoEnabled}
        toggleVideoBtnDisabled={isInitiatingCall}
        toggleSpeaker={toggleSpeaker}
        toggleVideo={toggleVideo}
        endCall={endCall}
        toggleMuteMicrophone={toggleMuteMicrophone}
      />
      <VideoCallUI 
        localStream={localStream}
        remoteStream={remoteStream}
        localVideoEnabled={localVideoEnabled}
        callee={callee}
        muted={muted}
        videoEnabled={localVideoEnabled}
        toggleCameraFacingMode={toggleCameraFacingMode}
        toggleVideo={toggleVideo}
        endCall={endCall}
        toggleMuteMicrophone={toggleMuteMicrophone}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: -1
  }
});

export default CallScreen;

