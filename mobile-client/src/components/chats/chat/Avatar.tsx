import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { Images } from '../../../../assets/assets';
import { Colors } from '../../../variables/variables';

type AvatarProps = {
  avatar?: string;
};

const Avatar = ({ avatar }: AvatarProps) => {
  return (
    <View style={styles.imageContainer}>
      {avatar ?
        <Image 
          style={styles.image} 
          source={{ uri: avatar }}
          /> : 
        <Image style={styles.image} source={ Images.avatarSmall } />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 5,
    overflow: 'hidden', 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    marginHorizontal: 8,
    backgroundColor: Colors.lightGrey
  },
  image: {
    width: '100%', 
    height: '100%'
  }
});

export default Avatar;