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
import api from 'api';
import pushNotifications from 'services/pushNotifications';
import { pushNotificationsService } from 'services';

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
    isRequestingVideo,
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

    const contact = userId === caller._id ? callee : caller;

    navigation.navigate('CurrentChat', { 
      chatType, 
      chatId, 
      contactId: contact._id, 
      contactName: contact.username, 
      contactProfile: contact.avatar.small 
    });
  };

  const toggleSpeaker = (): void => {
    if (Platform.OS === 'ios') {
      InCallManager.setForceSpeakerphoneOn(!speaker);
    }
    dispatch(callActions.toggleSpeaker());
  };

  const requestVideo = async (): Promise<void> => {
    localStream.getTracks().forEach((track: any) => {
      if (track.kind === 'video')  {
        track.enabled = !localVideoEnabled;
      }
    } );
    dispatch(callActions.toggleLocalStream());
    dispatch(callActions.requestVideo(true));
    
    // Notify contact of change to remote stream
    const contactId = userId === caller._id ? callee._id : caller._id;

    await pushNotificationsService.eventPushers.callPushers.pushRequestVideo(chatId, contactId);
  };

  const toggleVideo = async (): Promise<void> => {
    localStream.getTracks().forEach((track: any) => {
      if (track.kind === 'video')  {
        track.enabled = !localVideoEnabled;
      }
    } );
    dispatch(callActions.toggleLocalStream());
    
    // Notify contact of change to remote stream
    const contactId = userId === caller._id ? callee._id : caller._id;

    await pushNotificationsService.eventPushers.callPushers.pushToggleVideo(chatId, contactId);
  };

  const toggleCameraFacingMode = (): void => {
    localStream.getVideoTracks()[0]._switchCamera();
  };

  const toggleMuteMicrophone = (): void => {
    // RNCallKeep.setMutedCall(uuid, true); // try it
    localStream.getTracks().forEach((track: any) => {
      if (track.kind === 'audio')  {
        console.log(track)
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
        requestVideo={requestVideo}
        endCall={endCall}
        toggleMuteMicrophone={toggleMuteMicrophone}
      />
      <VideoCallUI 
        localStream={localStream}
        remoteStream={remoteStream}
        localVideoEnabled={localVideoEnabled}
        remoteVideoEnabled={remoteVideoEnabled}
        isRequestingVideo={isRequestingVideo}
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
  }
});

export default CallScreen;

