import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Headings } from 'variables';
import CustomText from 'components/CustomText';
import AudioCallActions from 'components/call/AudioCallActions';
import AudioCallAvatar from 'components/call/AudioCallAvatar';

type AudioCallUIProps = {
  show: boolean;
  contactAvatar: string;
  callee: TContact;
  isInitiatingCall: boolean;
  speaker: boolean;
  muted: boolean;
  localVideoEnabled: boolean;
  toggleVideoBtnDisabled: boolean;
  toggleSpeaker: () => void;
  requestVideo: () => void;
  endCall: () => void;
  toggleMuteMicrophone: () => void; 
};

const AudioCallUI = ({
  show, 
  contactAvatar,
  callee,
  isInitiatingCall,
  speaker,
  muted,
  localVideoEnabled,
  toggleVideoBtnDisabled,
  toggleSpeaker,
  requestVideo,
  endCall,
  toggleMuteMicrophone
}: AudioCallUIProps) => {

  return (
    <View style={[
      styles.container,
      { zIndex: show ? 2 : -2, elevation: show ? 2 : -2 }
    ]}>
      <AudioCallAvatar contactAvatar={contactAvatar} showPulse={isInitiatingCall} />
      <View style={styles.calleeName}>
        <CustomText color={Colors.purpleDark} fontSize={Headings.headingExtraLarge}>
          {callee.username}
        </CustomText>
        {isInitiatingCall &&
          <CustomText color={Colors.purpleDark} fontSize={Headings.headingMedium}>
            Ringing...
          </CustomText>
        }
      </View>
      <AudioCallActions 
        speaker={speaker}
        muted={muted}
        localVideoEnabled={localVideoEnabled}
        toggleVideoBtnDisabled={toggleVideoBtnDisabled}
        onToggleSpeaker={toggleSpeaker}
        onRequestVideo={requestVideo}
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
    backgroundColor: Colors.purpleLight,
    alignItems: 'center'
  },
  calleeName: {
    marginTop: 20,
    alignItems: 'center',
    zIndex: 2
  }
});

export default AudioCallUI;

