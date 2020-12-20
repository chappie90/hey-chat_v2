import React from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  useWindowDimensions
} from 'react-native';

import ScaleImageAnim from 'components/animations/ScaleImageAnim';
import TranslateFadeViewAnim from 'components/animations/TranslateFadeViewAnim';
import CustomText from 'components/CustomText';
import { Images } from 'assets';

type SearchIconProps = {
  isFirstRender: boolean;
};

const SearchIcon = ({ isFirstRender }: SearchIconProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth = windowWidth - 120;
  const imageHeight = (windowWidth - 120 ) / 1.4;

  if (isFirstRender) {
    return (
      <View style={styles.imageContainer}>
        <ScaleImageAnim 
          style={{
            width: imageWidth,
            height: imageHeight
          }} 
          source={ Images.findContacts } 
        />
        <TranslateFadeViewAnim>
          <CustomText style={styles.imageCaption}>Stay in touch with your loved ones</CustomText>
        </TranslateFadeViewAnim>
      </View>
    );
  }
  
  return (
    <View style={styles.imageContainer}>
      <Image 
        style={{
          width: imageWidth,
          height: imageHeight
        }}  
        source={ Images.findContacts } 
      />
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
  imageCaption: {
    textAlign: 'center',
    marginTop: 10
  }
});

export default SearchIcon;

