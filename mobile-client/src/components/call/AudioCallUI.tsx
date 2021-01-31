import React, { useEffect } from 'react';
import {
  StyleSheet, 
  View, 
  Image, 
  useWindowDimensions,
  Platform
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Colors, Headings } from 'variables';
import CustomText from 'components/CustomText';
import CustomButton from 'components/common/CustomButton';
import AudioCallActions from 'components/call/AudioCallActions';

type AudioCallUIProps = {
  show: boolean;
  callee: TContact;
  speaker: boolean;
  muted: boolean;
  toggleSpeaker: () => void;
  toggleVideo: () => void;
  endCall: () => void;
  toggleMuteMicrophone: () => void; 
};

const AudioCallUI = ({
  show, 
  callee,
  speaker,
  muted,
  toggleSpeaker,
  toggleVideo,
  endCall,
  toggleMuteMicrophone
}: AudioCallUIProps) => {

  return (
    <View style={[
      styles.container,
      { zIndex: show ? 2 : 0 }
    ]}>
      <View style={styles.calleeName}>
        <CustomText color={Colors.purpleDark} fontSize={Headings.headingExtraLarge}>
          {callee.username}
        </CustomText>
      </View>
      <AudioCallActions 
        speaker={speaker}
        muted={muted}
        onToggleSpeaker={toggleSpeaker}
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
    backgroundColor: Colors.purpleLight
  },
  calleeName: {
    position:'absolute', 
    top: 100, 
    alignSelf: 'center', 
    zIndex: 2
  },
  actions: {
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
    backgroundColor: Colors.white,
    borderRadius: 31,
    width: 62,
    height: 62
  }
});

export default AudioCallUI;

