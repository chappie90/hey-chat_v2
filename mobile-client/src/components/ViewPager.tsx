import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import LottieView from 'lottie-react-native';

import { Animations } from 'assets';
import CustomText from './CustomText';
import ScaleImageAnim from 'components/animations/ScaleImageAnim';
import TranslateFadeViewAnim from 'components/animations/TranslateFadeViewAnim';
import { Colors, Fonts, Headings } from 'variables';


type StarterPagerProps = {
  onPageChange: (activeIndex: number) => void;
};

const StarterPager = ({ onPageChange }: StarterPagerProps) => {
  const window = useWindowDimensions();
  const imageDimensions = {
    width: window.width * 0.85,
    height: window.width * 0.85 / 1.522
  };

  return (
    <ViewPager
      style={styles.viewPager} 
      initialPage={0}
      onPageScroll={(e) => onPageChange(e.nativeEvent.position)}
    >
      <View style={styles.page} key="1">
        <TranslateFadeViewAnim style={styles.textContainer}>
          <CustomText style={styles.text}>
            Stay in touch with the people you love
          </CustomText>
        </TranslateFadeViewAnim>
        <LottieView 
          source={ Animations.starterAnimChat } 
          autoPlay 
          loop 
        />
      </View>
      <View style={styles.page} key="2">
        <TranslateFadeViewAnim style={styles.textContainer}>
          <CustomText style={styles.text}>
            Always know what your friends are up to
          </CustomText>
        </TranslateFadeViewAnim>
        <LottieView 
          source={ Animations.starterAnimActive } 
          autoPlay 
          loop 
        />
      </View>
      <View style={styles.page} key="3">
        <TranslateFadeViewAnim style={styles.textContainer}>
          <CustomText style={styles.text}>
            Watch your favourite videos while chatting with your friends
          </CustomText>
        </TranslateFadeViewAnim>
        <LottieView 
          source={ Animations.starterAnimYoutube } 
          autoPlay 
          loop 
        />
      </View>
      <View style={styles.page} key="4">
        <TranslateFadeViewAnim style={styles.textContainer}>
          <CustomText style={styles.text}>
            Create groups based on shared interests
          </CustomText>
        </TranslateFadeViewAnim>
        <LottieView 
          source={ Animations.starterAnimGroup } 
          autoPlay 
          loop 
        />
      </View>
    </ViewPager>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  textContainer: {
    position: 'absolute',
    top: 140,
    zIndex: 2
  },
  text: {
    textAlign: 'center'
  }
});

export default StarterPager;