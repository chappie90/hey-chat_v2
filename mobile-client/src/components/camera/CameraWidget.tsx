import React, { useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  useWindowDimensions,
  Animated
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { RNCamera } from 'react-native-camera';

import { Colors } from '../../variables/variables';

type CameraWidgetProps = {
  isVisible: boolean;
  onTakePhoto: (photoData: TCameraPhoto) => void;
  onHideCamera: () => void; 
 };

const CameraWidget = ({ isVisible, onTakePhoto, onHideCamera }: CameraWidgetProps) => {
  const windowWidth = useWindowDimensions().width;
  const cameraRef = useRef<RNCamera | null>(null);
  const opacityAnim = useRef(new Animated.Value(0));

  const takePhoto = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      onTakePhoto(data);
    }
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
      <View style={[ styles.takePhotoBtn, { left: windowWidth / 2 - 30 } ]}>
        <TouchableOpacity onPress={() => takePhoto()}>
          <View style={styles.takePhotoIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.closeCameraBtn}>
        <TouchableOpacity 
          onPress={() => onHideCamera()} 
          activeOpacity={0.5}
        >
          <MaterialIcon color={Colors.purpleDark} name="close" size={40} />
        </TouchableOpacity>
      </View>
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
    zIndex: 6 
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
    zIndex: 6
  }
});

export default CameraWidget;