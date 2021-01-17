import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';

import CustomButton from 'components/common/CustomButton';
import { Colors } from 'variables';

type VideoCallActionsProps = {
  onToggleCameraFacingMode: () => void;
  onEndCall: () => void;
  onToggleMuteMicrophone: () => void; 
};

const VideoCallActions = ({ 
  onToggleCameraFacingMode,
  onEndCall,
  onToggleMuteMicrophone
 }: VideoCallActionsProps) => {

  return (
    <View style={styles.container}>
      <CustomButton 
        layout={styles.actionBtnLayout} 
        buttonStyle={[ styles.actionBtn, styles.secondaryBtn ]} 
        onPress={onToggleCameraFacingMode}
      >
        <Ionicon name="camera-reverse" size={44} color={Colors.purpleDark} /> 
      </CustomButton>
      <CustomButton 
        layout={styles.actionBtnLayout}
        buttonStyle={[ styles.actionBtn, styles.primaryBtn ]} 
        onPress={onEndCall}
      >
        <MaterialCommunityIcon name="phone-hangup" size={50} color={Colors.white} /> 
      </CustomButton>
      <CustomButton 
        layout={styles.actionBtnLayout} 
        buttonStyle={[ styles.actionBtn, styles.secondaryBtn ]} 
        onPress={onToggleMuteMicrophone}
      >
        <FontAwesomeIcon 
          name={true ? "microphone-slash" : "microphone"} 
          size={40} 
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
    zIndex: 2
  },
  actionBtnLayout: {},
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryBtn: {
    backgroundColor: Colors.red,
    borderRadius: 35,
    width: 70,
    height: 70,
  },
  secondaryBtn: {
    backgroundColor: Colors.white,
    borderRadius: 28,
    width: 56,
    height: 56
  }
});

export default VideoCallActions;

