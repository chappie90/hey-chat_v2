import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import config from 'react-native-config';

import { Images } from 'assets';
import { Colors } from 'variables';

type AvatarProps = {
  avatar?: string;
};

const Avatar = ({ avatar }: AvatarProps) => {
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/small`;

  return (
    <View style={styles.imageContainer}>
      {avatar ?
        <Image 
          style={styles.image} 
          source={{ uri: `${S3_BUCKET_PATH}/${avatar}` }}
          /> : 
        <Image style={styles.image} source={ Images.avatarSmall } />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    bottom: 16,
    left: 10,
    zIndex: 5,
    overflow: 'hidden', 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    backgroundColor: Colors.greyLight
  },
  image: {
    width: '100%', 
    height: '100%'
  }
});

export default Avatar;