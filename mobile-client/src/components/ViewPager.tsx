import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import LottieView from 'lottie-react-native';

import { Images, Animations } from 'assets';
import CustomText from './CustomText';
import ScaleImageAnim from 'components/animations/ScaleImageAnim';
import TranslateFadeViewAnim from 'components/animations/TranslateFadeViewAnim';


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
        <LottieView 
          source={ Animations.starterAnimChat } 
          autoPlay 
          loop 
        />
        <TranslateFadeViewAnim style={styles.textContainer}>
          <CustomText style={styles.text}>
            Stay in touch with the people you love
          </CustomText>
        </TranslateFadeViewAnim>
        {/* <ScaleImageAnim 
          source={ Images.starterChat } 
          style={ imageDimensions } 
        />
         */}
      </View>
      <View style={styles.page} key="2">
        <LottieView 
          source={ Animations.starterAnimActive } 
          autoPlay 
          loop 
        />
        <TranslateFadeViewAnim style={styles.textContainer}>
          <CustomText style={styles.text}>
            Always know what your friends are up to
          </CustomText>
        </TranslateFadeViewAnim>
        {/* <Image 
          source={ Images.starterActive } 
          style={ imageDimensions }  
        />
      */}
      </View>
      <View style={styles.page} key="3">
        <LottieView 
          source={ Animations.starterAnimYoutube } 
          autoPlay 
          loop 
        />
        <TranslateFadeViewAnim style={styles.textContainer}>
          <CustomText style={styles.text}>
            Watch your favourite videos while chatting with your friends
          </CustomText>
        </TranslateFadeViewAnim>
        {/* <Image 
          source={ Images.starterYoutube } 
          style={ imageDimensions }  
        />
       */}
      </View>
      <View style={styles.page} key="4">
        <LottieView 
          source={ Animations.starterAnimGroup } 
          autoPlay 
          loop 
        />
        <TranslateFadeViewAnim style={styles.textContainer}>
          <CustomText style={styles.text}>
            Create groups based on shared interests
          </CustomText>
        </TranslateFadeViewAnim>
        {/* <Image 
          source={ Images.starterGroup } 
          style={ imageDimensions } 
        />
       */}
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
    top: '74%'
  },
  text: {
    textAlign: 'center' 
  }
});

export default StarterPager;