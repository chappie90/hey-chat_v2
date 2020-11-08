import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  PermissionsAndroid,
  Platform,
  Image,
  FlatList
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CameraRoll from "@react-native-community/cameraroll";

import { Colors } from '../../variables/variables';
import CustomText from '../../components/CustomText';

type CameraWidgetProps = {
  isVisible: boolean;
  onSelectPhoto: (photoData: TCameraPhoto) => void;
  onHideLibrary: () => void; 
 };

const CameraWidget = ({ isVisible, onSelectPhoto, onHideLibrary }: CameraWidgetProps) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const opacityAnim = useRef(new Animated.Value(0));
  const opacitySelectPhotoAnim = useRef(new Animated.Value(0));
  const [photos, setPhotos] = useState<any>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<TCameraPhoto | null>(null);

  const hasAndroidPermission = async (): Promise<boolean> => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
   
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
   
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
   
  const getLibraryPhotos = async () => {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
   
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
      include: [
        "filename"
      ]
    })
    .then(response => {
      setPhotos(response.edges);
    })
    .catch(err => console.log(err));

  };

  const onPreviewPhoto = (photoData: TCameraPhoto) => {
    setSelectedPhoto(photoData);
  };  

  const onCancelPhoto = (): void => {
    setSelectedPhoto(null);
  };

  const onCloseLibrary = (): void => {
    onHideLibrary();
    setSelectedPhoto(null);
  };

  const onChoosePhoto = (): void => {
    if (selectedPhoto) onSelectPhoto(selectedPhoto);
    setSelectedPhoto(null);
    onHideLibrary();
  };

  useEffect(() => {
    if (isVisible) getLibraryPhotos();

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
      opacitySelectPhotoAnim.current, { 
        toValue: selectedPhoto ? 1 : 0,
        duration: 350,
        delay: 200,
        useNativeDriver: true
      }
    ).start();
  }, [selectedPhoto]);

  if (!isVisible) return <></>;

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: opacityAnim.current }
      ]}
    >
      <View style={styles.closeCameraBtn}>
        <TouchableOpacity 
          onPress={() => onCloseLibrary()} 
          activeOpacity={0.5}
        >
          <MaterialIcon color={Colors.purpleDark} name="close" size={40} />
        </TouchableOpacity>
      </View>
      {photos.length > 0 &&
        <FlatList
          initialNumToRender={20}
          data={photos}
          keyExtractor={item => item.node.timestamp.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity activeOpacity={0.5} onPress={() => onPreviewPhoto(item.node.image)}>
                <Image
                  style={[
                    {
                      width: windowWidth / 4,
                      height: windowWidth / 4
                    }
                  ]}
                  source={{ uri: item.node.image.uri }}
                />
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.imagesContainer} 
          numColumns={4}
        />
      }
      {selectedPhoto &&
        <Animated.View 
          style={[
            styles.photoContainer,
            { opacity: opacitySelectPhotoAnim.current }
          ]}
        >
          <View 
            style={[ 
              styles.actionBtn,
              styles.cancelBtn,
              { left: windowWidth /  10 + 8 } 
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
            source={{ uri: selectedPhoto.uri }}
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
        </Animated.View>
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
    zIndex: 5,
    backgroundColor: Colors.black
  },
  imagesContainer: {
    flexDirection : 'column'
  },
  closeCameraBtn: {
    alignSelf: 'flex-end',
    padding: 10
  },
  photoContainer: {
    position: 'absolute',
    top: 0,
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