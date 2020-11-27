import React from 'react';
import { 
  View, 
  StyleSheet,
  Image
} from 'react-native';

import ScaleImageAnim from 'components/animations/ScaleImageAnim';
import TranslateFadeViewAnim from 'components/animations/TranslateFadeViewAnim';
import CustomText from 'components/CustomText';
import { Images } from 'assets';

type SearchIconProps = {
  isFirstRender: boolean;
};

const SearchIcon = ({ isFirstRender }: SearchIconProps) => {
  if (isFirstRender) {
    return (
      <View style={styles.imageContainer}>
        <ScaleImageAnim style={styles.image} source={ Images.searchGreenBig } />
        <TranslateFadeViewAnim>
          <CustomText style={styles.imageCaption}>Stay in touch with your loved ones</CustomText>
        </TranslateFadeViewAnim>
      </View>
    );
  }
  
  return (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={ Images.searchGreenBig } />
      <View>
        <CustomText style={styles.imageCaption}>Stay in touch with your loved ones</CustomText>
      </View>
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

export default SearchIcon;

