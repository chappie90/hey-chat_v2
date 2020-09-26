import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Image,
  useWindowDimensions 
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';

import { Images } from '../../assets/assets';
import CustomText from './CustomText';
import ScaleImageAnim from './animations/ScaleImageAnim';
import TranslateFadeViewAnim from './animations/TranslateFadeViewAnim';

const StarterPager = () => {
  const window = useWindowDimensions();
  const imageDimensions = {
    width: window.width * 0.85,
    height: window.width * 0.85 / 1.522
  };

  return (
    <ViewPager style={styles.viewPager} initialPage={0}>
      <View style={styles.page} key="1">
        <ScaleImageAnim 
          source={ Images.starterChat } 
          style={ imageDimensions } 
        />
        <TranslateFadeViewAnim>
          <CustomText style={styles.text}>
            Stay in touch with the people you love
          </CustomText>
        </TranslateFadeViewAnim>
      </View>
      <View style={styles.page} key="2">
        <Image 
          source={ Images.starterActive } 
          style={ imageDimensions }  
        />
        <CustomText style={styles.text}>
          Always know what your friends are up to
        </CustomText>
      </View>
      <View style={styles.page} key="3">
        <Image 
          source={ Images.starterYoutube } 
          style={ imageDimensions }  
        />
        <CustomText style={styles.text}>
          Watch your favourite videos while chatting with your friends
        </CustomText>
      </View>
      <View style={styles.page} key="4">
        <Image 
          source={ Images.starterGroup } 
          style={ imageDimensions } 
        />
        <CustomText style={styles.text}>
          Create groups based on shared interests
        </CustomText>
      </View>
    </ViewPager>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  text: {
    textAlign: 'center'
  }
});

export default StarterPager;