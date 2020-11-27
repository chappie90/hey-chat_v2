import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Animated,
  Image
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { RNCamera } from 'react-native-camera';

import { Colors } from 'variables';
import CustomText from 'components/CustomText';

type CameraWidgetProps = {
  isVisible: boolean;
  onSelectPhoto: (photoData: TCameraPhoto) => void;
  onHideCamera: () => void; 
 };

const CameraWidget = ({ isVisible, onSelectPhoto, onHideCamera }: CameraWidgetProps) => {
  const [photo, setPhoto] = useState<TCameraPhoto | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const cameraRef = useRef<RNCamera | null>(null);
  const opacityAnim = useRef(new Animated.Value(0));
  const opacityTakePhotoAnim = useRef(new Animated.Value(0));

  const onTakePhoto = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      setPhoto(data);
    }
  };

  const onCancelPhoto = (): void => {
    setPhoto(null);
  };

  const onCloseCamera = (): void => {
    onHideCamera();
    setPhoto(null);
  };

  const onChoosePhoto = (): void => {
    if (photo) onSelectPhoto(photo);
    setPhoto(null);
    onHideCamera();
  };

  useEffect(() => {
    Animated.timing(
      opacityAnim.current, { 
          toValue: isVisible ? 1 : 0,
          duration: 250,
          useNativeDriver: true
        }
    ).start();
  }, [isVisible]);

  useEffect(() => {
    Animated.timing(
      opacityTakePhotoAnim.current, { 
        toValue: photo ? 1 : 0,
        duration: 350,
        useNativeDriver: true
      }
    ).start();
  }, [photo]);

  if (!isVisible) return <></>;

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: opacityAnim.current }
      ]}
    >
      <RNCamera
        style={styles.camera}
        ref={cameraRef}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'This app need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      {photo ?
        (
          <Animated.View 
            style={[
              styles.photoContainer,
              { opacity: opacityTakePhotoAnim.current }
            ]}
          >
            <View 
              style={[ 
                styles.actionBtn,
                styles.cancelBtn,
                { left: windowWidth /  10 } 
              ]
            }>
              <TouchableOpacity activeOpacity={0.5} onPress={() => onCancelPhoto()}>
                <View style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                  <CustomText color={Colors.greyDark}>Cancel</CustomText>
                </View>
              </TouchableOpacity>
            </View>
            <Image
              style={{ width: windowWidth, height: windowHeight }}
              source={{ uri: photo.uri }}
            />
            <View 
              style={[ 
                styles.actionBtn,
                styles.chooseBtn,
                { right: windowWidth / 10 } 
              ]}
            >
              <TouchableOpacity activeOpacity={0.5} onPress={() => onChoosePhoto()}>
                <View style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                  <CustomText color={Colors.white}>Choose</CustomText>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View >
        ) :
        (
          <>
            <View style={styles.closeCameraBtn}>
              <TouchableOpacity 
                onPress={() => onCloseCamera()} 
                activeOpacity={0.5}
              >
                <MaterialIcon color={Colors.purpleDark} name="close" size={40} />
              </TouchableOpacity>
            </View>
            <View style={[ styles.takePhotoBtn, { left: windowWidth / 2 - 30 } ]}>
              <TouchableWithoutFeedback onPress={() => onTakePhoto()}>
                <View style={styles.takePhotoIcon} />
              </TouchableWithoutFeedback>
            </View>
          </>
        )
      }
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5
  },
  camera: {
    flex: 1
  },
  takePhotoBtn: {
    position: 'absolute', 
    bottom: 30,  
    zIndex: 7
  },
  takePhotoIcon: {
    width: 50,
    height: 50,
    borderColor: Colors.purpleDark,
    borderWidth: 6,
    borderRadius: 25
  },
  closeCameraBtn: {
    position: 'absolute',
    right: 40,
    top: 40,
    zIndex: 7
  },
  photoContainer: {
    position: 'absolute',
    top: -3,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 6
  },
  actionBtn: {
    position: 'absolute',
    bottom: 35,
    zIndex: 7,
    borderRadius: 35
  },
  cancelBtn: {
    backgroundColor: Colors.purpleLight
  },
  chooseBtn: {
    backgroundColor: Colors.purpleDark 
  }
});

export default CameraWidget;