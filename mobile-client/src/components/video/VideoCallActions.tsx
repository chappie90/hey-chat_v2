import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';

import CustomButton from 'components/common/CustomButton';
import { Colors } from 'variables';

type VideoCallActionsProps = {
  muted: boolean;
  videoEnabled: boolean;
  onToggleCameraFacingMode: () => void;
  onEndCall: () => void;
  onToggleMuteMicrophone: () => void; 
};

const VideoCallActions = ({ 
  muted,
  videoEnabled,
  onToggleCameraFacingMode,
  onEndCall,
  onToggleMuteMicrophone
 }: VideoCallActionsProps) => {

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 20, 
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: -1
  },
  actionBtnLayout: {},
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryBtn: {
    backgroundColor: Colors.red,
    borderRadius: 37,
    width: 74,
    height: 74,
  },
  secondaryBtn: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    width: 60,
    height: 60
  }
});

export default VideoCallActions;

