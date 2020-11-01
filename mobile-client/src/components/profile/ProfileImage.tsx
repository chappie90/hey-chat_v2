import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Colors, Fonts, Headings } from '../../variables/variables';
import CustomText from '../../components/CustomText';
import { Images } from '../../../assets/assets';

type ProfileImageProps = { onToggleImageActions: () => void };

const ProfileImage = ({ onToggleImageActions }: ProfileImageProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => onToggleImageActions ()}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {false ?
            <Image 
              source={{ uri: '' }}
              style={styles.image} /> : 
            <Image source={ Images.avatarBig } style={styles.image} />
          }
        </View>   
        <View style={styles.cameraIconContainer}>
          <MaterialIcon name="camera-alt" size={36} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15%',
    marginBottom: 30,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: Colors.white,
    overflow: 'hidden',
    backgroundColor: Colors.white
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cameraIconContainer: {
    backgroundColor: Colors.greyLight,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.white,
    position: 'absolute',
    top: '72%',
    transform: [
      { translateX: 70 }
    ]
  },
});

export default ProfileImage;