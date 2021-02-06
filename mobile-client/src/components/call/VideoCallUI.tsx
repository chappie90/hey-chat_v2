import React from 'react';
import { StyleSheet, View, useWindowDimensions, Image } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { RTCView } from 'react-native-webrtc';
import Draggable from 'react-native-draggable';
import { BlurView } from "@react-native-community/blur";

import CustomButton from 'components/common/CustomButton';
import { Colors, Headings } from 'variables';
import CustomText from 'components/CustomText';
import VideoCallActions from 'components/call/VideoCallActions';

type VideoCallUIProps = {
  localStream: any;
  remoteStream: any;
  localVideoEnabled: boolean;
  remoteVideoEnabled: boolean;
  isRequestingVideo: boolean;
  callee: TContact;
  muted: boolean;
  videoEnabled: boolean;
  toggleCameraFacingMode: () => void;
  toggleVideo: () => void;
  endCall: () => void;
  toggleMuteMicrophone: () => void; 
};

const VideoCallUI = ({ 
  localStream,
  remoteStream,
  localVideoEnabled,
  remoteVideoEnabled,
  isRequestingVideo,
  callee,
  muted,
  videoEnabled,
  toggleCameraFacingMode,
  toggleVideo,
  endCall,
  toggleMuteMicrophone
 }: VideoCallUIProps) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {remoteStream &&
         <RTCView streamURL={remoteStream.toURL()} style={styles.remoteStream} objectFit="cover" />
      }
      {remoteStream && !remoteVideoEnabled && !isRequestingVideo &&
        <View style={styles.disabledRemoteVideo}>
          <CustomText>{callee.username} has disabled the camera</CustomText>
        </View> 
      }
      {remoteStream && !remoteVideoEnabled && isRequestingVideo &&
        <View style={styles.disabledRemoteVideo}>
          <CustomText>Requesting video call...</CustomText>
        </View> 
      }
      {localStream &&
        <Draggable 
          x={remoteStream ? windowWidth - 150 : 0} 
          y={remoteStream ? 20 : 0} 
          touchableOpacityProps={{ activeOpacity: 1 }}
          minX={20}
          minY={20}
          maxX={windowWidth - 20}
          maxY={windowHeight - 40}
          onShortPressRelease={()=> console.log('touched!!')}
        >
          <View style={remoteStream ?
            styles.partialLocalStreamContainer :
            { width: windowWidth, height: windowHeight }
            }>
              {!localVideoEnabled &&
                <BlurView
                  style={styles.disabledLocalVideo}
                  blurType="light"
                  blurAmount={10}
                  reducedTransparencyFallbackColor="white"
                />
              }
              <RTCView streamURL={localStream.toURL()} style={styles.localStream} objectFit="cover" />
          </View>
        </Draggable>
      }
      <View style={styles.calleeName}>
        <CustomText color={Colors.purpleDark} fontSize={Headings.headingExtraLarge}>
          {callee.username}
        </CustomText>
      </View>
      <VideoCallActions 
        muted={muted}
        onToggleCameraFacingMode={toggleCameraFacingMode}
        onToggleVideo={toggleVideo}
        onEndCall={endCall}
        onToggleMuteMicrophone={toggleMuteMicrophone}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0, 
    right: 0,
    bottom: 0,
    zIndex: -2,
    elevation: -2,
    backgroundColor: Colors.purpleLight
  },
  remoteStream: {
    flex: 1
  }, 
  partialLocalStreamContainer: {
    width: 140,
    height: 190,
    borderRadius: 25,
    overflow: 'hidden',
    zIndex: 1,
    elevation: 1
  },
  localStream: {
    width: '100%',
    height: '100%'
  },
  disabledLocalVideo: {
    position: 'absolute',
    zIndex: 2,
    elevation: 2,
    width: '100%',
    height: '100%'
  },
  disabledRemoteVideo: {
    position: 'absolute',
    zIndex: 0,
    elevation: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.purpleLight
  },
  calleeName: {
    position:'absolute', 
    top: 50, 
    alignSelf: 'center', 
    zIndex: 1,
    elevation: 1
  }
});

export default VideoCallUI;

