import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Colors } from 'variables';
import CustomButton from 'components/common/CustomButton';

type AudioCallActionsProps = {
  speaker: boolean;
  muted: boolean;
  localVideoEnabled: boolean;
  toggleVideoBtnDisabled: boolean;
  onToggleSpeaker: () => void;
  onRequestVideo: () => void;
  onEndCall: () => void;
  onToggleMuteMicrophone: () => void; 
};

const AudioCallActions = ({
  speaker,
  muted,
  localVideoEnabled,
  toggleVideoBtnDisabled,
  onToggleSpeaker,
  onRequestVideo,
  onEndCall,
  onToggleMuteMicrophone
}: AudioCallActionsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.actionsFirstRow}>
        <CustomButton 
          layout={styles.actionBtnLayout}
          buttonStyle={[ 
            styles.actionBtn, 
            styles.secondaryBtn,
            { backgroundColor: speaker ? Colors.purpleDark : Colors.white }
          ]} 
          activeOpacity={1}
          onPress={onToggleSpeaker}
        >
          <EntypoIcon 
            name={speaker ? "sound-mute" : "sound"} 
            size={38} 
            color={speaker ? Colors.white : Colors.purpleDark}
          /> 
        </CustomButton>
        <CustomButton
          layout={styles.actionBtnLayout} 
          buttonStyle={[ 
            styles.actionBtn, 
            styles.secondaryBtn,
            { backgroundColor: Colors.white }
          ]} 
          disabled={toggleVideoBtnDisabled}
          onPress={() => onRequestVideo()}
        >
          <FontAwesomeIcon 
            name="video-camera" 
            size={30} 
            color={toggleVideoBtnDisabled ? Colors.purpleLight : Colors.purpleDark}
          /> 
        </CustomButton>
        <CustomButton 
          layout={styles.actionBtnLayout} 
          buttonStyle={[ 
            styles.actionBtn, 
            styles.secondaryBtn,
            { backgroundColor: muted ? Colors.purpleDark : Colors.white } 
          ]} 
          activeOpacity={1}
          onPress={onToggleMuteMicrophone}
        >
          <FontAwesomeIcon 
            name={muted ? "microphone-slash" : "microphone"} 
            size={34} 
            color={muted ? Colors.white : Colors.purpleDark} 
          /> 
        </CustomButton>
      </View>
      <View style={styles.actionsSecondRow}>
        <CustomButton 
          layout={styles.actionBtnLayout}
          buttonStyle={[ styles.actionBtn, styles.primaryBtn ]} 
          activeOpacity={1}
          onPress={onEndCall}
        >
          <MaterialCommunityIcon name="phone-hangup" size={50} color={Colors.white} /> 
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20
  },
  actionsFirstRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30
  },
  actionsSecondRow: {
    alignSelf: 'center'
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
    borderRadius: 32,
    width: 64,
    height: 64
  }
});

export default AudioCallActions;

