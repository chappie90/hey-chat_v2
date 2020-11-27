import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Colors } from 'variables';

type ToolbarActionsProps = { isVisible: boolean };

const ToolbarActions = ({ isVisible }: ToolbarActionsProps) => {
   // Camera icon animations
   const bottomPosCamAnim = useRef(new Animated.Value(0));
   const leftPosCamAnim = useRef(new Animated.Value(0));
   const widthCamAnim = useRef(new Animated.Value(0));
   const heightCamAnim = useRef(new Animated.Value(0));
   const opacityCamAnim = useRef(new Animated.Value(0));
   // Image icon animations
   const bottomPosImgAnim = useRef(new Animated.Value(0));
   const leftPosImgAnim = useRef(new Animated.Value(0));
   const widthImgAnim = useRef(new Animated.Value(0));
   const heightImgAnim = useRef(new Animated.Value(0));
   const opacityImgAnim = useRef(new Animated.Value(0));

   const takePhotoHandler = () => {

  };

  const choosePhotoHandler = () => {

  };

  useEffect(() => {
    // Camera icon animations
    Animated.timing(
      bottomPosCamAnim.current, { 
        toValue: isVisible ? 135 : 0,
        duration: 200,
        delay: 70,
        useNativeDriver: false
      }
    ).start();  
    Animated.timing(
      leftPosCamAnim.current, { 
        toValue: isVisible ? 35 : 0,
        duration: 200,
        delay: 70,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      widthCamAnim.current, { 
        toValue: isVisible ? 70 : 0,
        duration: 200,
        delay: 70,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      heightCamAnim.current, { 
        toValue: isVisible ? 70 : 0,
        duration: 200,
        delay: 70,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      opacityCamAnim.current, { 
        toValue: isVisible ? 1 : 0,
        duration: 200,
        delay: 70,
        useNativeDriver: false
      }
    ).start();

    // Image icon animations
    Animated.timing(
      bottomPosImgAnim.current, { 
        toValue: isVisible ? 60 : 0,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      leftPosImgAnim.current, { 
        toValue: isVisible ? 35 : 0,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      widthImgAnim.current, { 
        toValue: isVisible ? 70 : 0,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      heightImgAnim.current, { 
        toValue: isVisible ? 70 : 0,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      opacityImgAnim.current, { 
        toValue: isVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
    }, [isVisible]);
  
  return (
    <>
      <TouchableWithoutFeedback onPress={takePhotoHandler}>
        <Animated.View 
          style={[
            styles.button,
            {
              width: widthCamAnim.current,
              height: heightCamAnim.current,
              bottom: bottomPosCamAnim.current,
              left: leftPosCamAnim.current,
              opacity: opacityCamAnim.current
            }
          ]}
        >
          <MaterialIcon color={Colors.purpleDark} name="camera-alt" size={37} />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={choosePhotoHandler}>
        <Animated.View 
          style={[
            styles.button,
            {
              width: widthImgAnim.current,
              height: heightImgAnim.current,
              bottom: bottomPosImgAnim.current,
              left: leftPosImgAnim.current,
              opacity: opacityImgAnim.current
            }
          ]}
        >
          <Ionicon color={Colors.purpleDark} name="md-images" size={34} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: Colors.purpleLight,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
});

export default ToolbarActions;