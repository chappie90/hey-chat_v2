import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import LottieView from 'lottie-react-native';

import TranslateFadeViewAnim from 'components/animations/TranslateFadeViewAnim';
import CustomText from 'components/CustomText';
import { Animations } from 'assets';

const ContactsIcon = () => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View style={styles.imageContainer}>
      <LottieView 
        source={ Animations.myContacts } 
        style={{
          width: windowWidth / 1.7,
          height: windowWidth / 1.7
        }}
        autoPlay 
        loop={false}
      />
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
  imageCaption: {
    textAlign: 'center',
    marginTop: 10
  }
});

export default ContactsIcon;

