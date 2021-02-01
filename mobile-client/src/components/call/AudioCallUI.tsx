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
  toggleVideo: () => void;
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
  toggleVideo,
  endCall,
  toggleMuteMicrophone
}: AudioCallUIProps) => {

  return (
    <View style={[
      styles.container,
      { zIndex: show ? 2 : 0 }
    ]}>
      <AudioCallAvatar contactAvatar={contactAvatar} />
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

