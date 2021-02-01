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

type VideoCallActionsProps = {
  muted: boolean;
  onToggleCameraFacingMode: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleMuteMicrophone: () => void; 
};

const VideoCallActions = ({ 
  muted,
  onToggleCameraFacingMode,
  onToggleVideo,
  onEndCall,
  onToggleMuteMicrophone
 }: VideoCallActionsProps) => {
  return (
    <>
      <CustomButton 
        layout={styles.tertiaryBtn}
        activeOpacity={1}
        onPress={onToggleVideo}
      >
        <MaterialCommunityIcon name="camera-off" size={45} color={Colors.white} /> 
      </CustomButton>
      <View style={styles.actions}>
        <CustomButton
          layout={styles.actionBtnLayout} 
          buttonStyle={[ styles.actionBtn, styles.secondaryBtn ]} 
          activeOpacity={1}
          onPress={onToggleCameraFacingMode}
        >
          <Ionicon name="camera-reverse" size={38} color={Colors.purpleDark} /> 
        </CustomButton>
        <CustomButton 
          layout={styles.actionBtnLayout}
          buttonStyle={[ styles.actionBtn, styles.primaryBtn ]} 
          activeOpacity={1}
          onPress={onEndCall}
        >
          <MaterialCommunityIcon name="phone-hangup" size={50} color={Colors.white} /> 
        </CustomButton>
        <CustomButton 
          layout={styles.actionBtnLayout} 
          buttonStyle={[ styles.actionBtn, styles.secondaryBtn ]} 
          activeOpacity={1}
          onPress={onToggleMuteMicrophone}
        >
          <FontAwesomeIcon 
            name={muted ? "microphone-slash" : "microphone"} 
            size={34} 
            color={Colors.purpleDark} 
          /> 
        </CustomButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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

export default VideoCallActions;

