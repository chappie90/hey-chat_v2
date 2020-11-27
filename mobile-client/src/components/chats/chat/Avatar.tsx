import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { Images } from 'assets';
import { Colors } from 'variables';

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
    bottom: 16,
    left: -45,
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