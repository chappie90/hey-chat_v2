import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { RTCView } from 'react-native-webrtc';
import Draggable from 'react-native-draggable';

import CustomButton from 'components/common/CustomButton';
import { Colors, Headings } from 'variables';
import CustomText from 'components/CustomText';
import VideoCallActions from 'components/call/VideoCallActions';

type VideoCallUIProps = {
  localStream: any;
  remoteStream: any;
  localVideoEnabled: boolean;
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
      {localStream && localVideoEnabled &&
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
    zIndex: 1,
    backgroundColor: Colors.purpleLight
  },
  remoteStream: {
    flex: 1,
    // zIndex: -2
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
  calleeName: {
    position:'absolute', 
    top: 50, 
    alignSelf: 'center', 
    zIndex: 1
  },
  actions: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  actionBtnLayout: {},
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tertiaryBtn: {
    position: 'absolute',
    right: 20,
    top: 50
  },
  primaryBtn: {
    backgroundColor: Colors.red,
    borderRadius: 37,
    width: 74,
    height: 74,
  },
  secondaryBtn: {
    backgroundColor: Colors.white,
    borderRadius: 31,
    width: 62,
    height: 62
  }
});

export default VideoCallUI;

