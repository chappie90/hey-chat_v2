import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import LottieView from 'lottie-react-native';

import { Animations } from 'assets';
import CustomText from './CustomText';

type StarterPagerProps = {
  onPageChange: (activeIndex: number) => void;
};

const StarterPager = ({ onPageChange }: StarterPagerProps) => {
  return (
    <ViewPager
      style={styles.viewPager} 
      initialPage={0}
      onPageScroll={(e) => onPageChange(e.nativeEvent.position)}
    >
      <View style={styles.page} key="1">
        <View style={styles.textContainer}>
          <CustomText style={styles.text}>
            Stay in touch with the people you love
          </CustomText>
        </View>
        <LottieView 
          source={ Animations.starterAnimChat } 
          autoPlay 
          loop 
        />
      </View>
      <View style={styles.page} key="2">
        <View style={styles.textContainer}>
          <CustomText style={styles.text}>
            Always know what your friends are up to
          </CustomText>
        </View>
        <LottieView 
          source={ Animations.starterAnimActive } 
          autoPlay 
          loop 
        />
      </View>
      <View style={styles.page} key="3">
        <View style={styles.textContainer}>
          <CustomText style={styles.text}>
            Watch your favourite videos while chatting with your friends
          </CustomText>
        </View>
        <LottieView 
          source={ Animations.starterAnimYoutube } 
          autoPlay 
          loop 
        />
      </View>
      <View style={styles.page} key="4">
        <View style={styles.textContainer}>
          <CustomText style={styles.text}>
            Create groups based on shared interests
          </CustomText>
        </View>
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
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    top: 120,
    zIndex: 2
  },
  text: {
    textAlign: 'center'
  }
});

export default StarterPager;