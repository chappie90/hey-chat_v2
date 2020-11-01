import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  useWindowDimensions
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { Colors, Fonts } from '../../variables/variables';
import CustomText from '../../components/CustomText';

type ImageActionsProps = { 
  isVisible: boolean;
  onShowCamera: () => void;
};

const ImageActions = ({ isVisible, onShowCamera }: ImageActionsProps) => {
  const { width: windowWidth }  = useWindowDimensions();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      scaleAnim, { 
         toValue: isVisible ? 1 : 0,
         duration: 200,
         useNativeDriver: true
       }
    ).start();
  }, [isVisible]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [
            { scale:  scaleAnim }
          ],
          left: windowWidth / 2 - 100 
        }
      ]}
    >
      <View style={styles.triangle} />
        <TouchableOpacity onPress={() => onShowCamera()} activeOpacity={0.5}>
          <View style={[styles.action, styles.takePhotoAction]}>
            <View style={styles.icon}>
              <MaterialIcon color={Colors.purpleDark} name="camera-alt" size={24} />
            </View>
            <CustomText fontWeight={Fonts.semiBold} color={Colors.purpleDark}>
              Take Photo
            </CustomText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} activeOpacity={0.5}>
          <View style={[styles.action, styles.choosePhotoAction]}>
            <View style={styles.icon}>
              <Ionicon color={Colors.purpleDark} name="md-images" size={24} />
            </View>
            <CustomText fontWeight={Fonts.semiBold} color={Colors.purpleDark}>
              Choose Photo
            </CustomText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} activeOpacity={0.5}>
          <View style={styles.action}>
            <View style={styles.icon}>
              <AntDesignIcon color={Colors.purpleDark} name="delete" size={24} />
            </View>
            <CustomText fontWeight={Fonts.semiBold} color={Colors.purpleDark}>
              Delete Photo
            </CustomText>
          </View>
        </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.purpleLight,
    width: 220,
    borderRadius: 35,
    position: 'absolute',
    top: 355
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.purpleLight,
    position: 'absolute',
    right: 45,
    top: -20,
    transform: [
       { rotate: '15deg' }
    ]
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14 
  },
  takePhotoAction: {
    borderBottomColor: Colors.white,
    borderBottomWidth: 1
  },
  choosePhotoAction: {
    borderBottomColor: Colors.white,
    borderBottomWidth: 1
  },
  icon: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  }
});

export default ImageActions;