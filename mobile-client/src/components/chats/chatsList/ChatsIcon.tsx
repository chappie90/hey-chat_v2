import React from 'react';
import { View, StyleSheet } from 'react-native';

import ScaleImageAnim from '../../../components/animations/ScaleImageAnim';
import TranslateFadeViewAnim from '../../../components/animations/TranslateFadeViewAnim';
import CustomText from '../../../components/CustomText';
import { Images } from '../../../../assets/assets';

const ChatsIcon = () => {
  return (
    <View style={styles.imageContainer}>
      <ScaleImageAnim style={styles.image} source={ Images.chatsBig } />
      <TranslateFadeViewAnim>
        <CustomText style={styles.imageCaption}>Stay in touch with your loved ones</CustomText>
      </TranslateFadeViewAnim>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '10%'
  },
  image: {
    width: 100,
    height: 100
  },
  imageCaption: {
    textAlign: 'center',
    marginTop: 10
  }
});

export default ChatsIcon;

