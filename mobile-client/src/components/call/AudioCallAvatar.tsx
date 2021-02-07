import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import config from 'react-native-config';
import Pulse from 'react-native-pulse';

import { Images } from 'assets';
import { Colors } from 'variables';

type AudioCallAvatarProps = {
  contactAvatar?: string;
  showPulse: boolean;
};

const AudioCallAvatar = ({ contactAvatar, showPulse }: AudioCallAvatarProps) => {
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/medium`;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {contactAvatar ?
          <Image 
            style={styles.image} 
            source={{ uri: `${S3_BUCKET_PATH}/${contactAvatar}` }}
            /> : 
          <Image style={styles.image} source={ Images.avatarBig } />
        }
      </View> 
      {showPulse &&   
        <View style={styles.pulse}>
          <Pulse 
            color={Colors.purpleDark} 
            numPulses={3} 
            diameter={300} 
            initialDiameter={0} 
            speed={14} 
            duration={400} 
          />
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    width: 180, 
    height: 180
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden', 
    borderRadius: 90, 
    backgroundColor: Colors.greyLight,
    zIndex: 2
  },
  image: {
    width: '105%', 
    height: '105%'
  },
  pulse: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110, 
    overflow: 'hidden',
    top: -20,
    left: -20,
    right: 180,
    bottom: 180,
  }
});

export default AudioCallAvatar;

