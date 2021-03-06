import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import api from 'api';
import { authActions } from 'reduxStore/actions';
import { Colors, Headings, Fonts } from 'variables';
import CustomText from 'components/CustomText';
import ProfileHeader from 'components/profile/ProfileHeader';
import ProfileImage from 'components/profile/ProfileImage';
import ImageActions from 'components/profile/ImageActions';
import CameraWidget from 'components/camera/CameraWidget';
import PhotosLibraryWidget from 'components/camera/PhotosLibraryWidget';
import { emitUpdateProfileImage } from 'socket/eventEmitters';

type ProfileScreenProps = BottomTabScreenProps<MainStackParams, 'Profile'>;

const ProfileScreen = ({ }: ProfileScreenProps) => {
  const { socketState } = useSelector(state => state.app);
  const { user: { _id: userId, username } } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [showImageActions, setShowImageActions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFinished, setUploadFinished] = useState(false);

  const onSignOut = (): void => {
    dispatch(authActions.signOut(userId, socketState));  
  }; 

  const onToggleImageActions = (): void => {
    setShowImageActions(!showImageActions);
  };

  const hideImageActions = (): void => {
    setShowImageActions(false);
  };

  const onShowCamera = (): void => {
    setShowCamera(true);
    hideImageActions();
  };

  const onHideCamera = (): void => {
    setShowCamera(false);
    hideImageActions();
  };

  const onSelectPhoto = (photoData: TCameraPhoto): void => {
    uploadProfileImage(photoData);
  };

  const onShowLibrary = (): void => {
    setShowLibrary(true);
    hideImageActions();
  };

  const onHideLibrary = (): void => {
    setShowLibrary(false);
  };

  const uploadProfileImage = async (imageData: TCameraPhoto): Promise<void> => {
    let imageUri;

    if (imageData.filename) {
      imageUri = `${imageData.uri}/${imageData.filename}`;
    } else {
      imageUri = imageData.uri;
    }

    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1].toLowerCase();

    let data = new FormData();
    data.append('profileImage',{
      uri: imageUri,
      name: username,
      type: `image/${fileType}`
    });
    data.append('userId', userId);

    api.post('/image/upload', data, {
      onUploadProgress: progressEvent => {
        const totalLength = progressEvent.lengthComputable ? 
          progressEvent.total : 
          progressEvent.target.getResponseHeader('content-length') || 
          progressEvent.target.getResponseHeader('x-decompressed-content-length');

        if (totalLength !== null) {
          setUploadProgress(Math.round(((progressEvent.loaded * 100) / totalLength) * 0.85));
        }  
      }
    })
    .then(response => {
      if (response.data) {
        setUploadFinished(true);
        setTimeout(() => {
          setUploadProgress(0);
          setUploadFinished(false);
        }, 1200);

        dispatch(authActions.updateAvatarImage(response.data.avatar));
        emitUpdateProfileImage(JSON.stringify({ userId }), socketState);
      }
    })
    .catch(error => {
      console.log('Upload image method error', error);
      if (error.response) console.log(error.response.data.message);
      if (error.message) console.log(error.message);
    });
  };

  const onDeleteImage = (): void => {
    dispatch(authActions.deleteAvatarImage(userId));
    hideImageActions();
  };

  useEffect(() => {
    dispatch(authActions.getAvatarImage(userId));
  }, []);

  useFocusEffect(
    useCallback(() => {

      return () => {
        setShowImageActions(false);
      };
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={() => hideImageActions()}>
      <View style={styles.container}>
        <ProfileHeader onSignOut={onSignOut} />
        <ProfileImage 
          uploadProgress={uploadProgress} 
          uploadFinished={uploadFinished}
          onToggleImageActions={onToggleImageActions} 
        />
        <CustomText 
          fontSize={Headings.headingExtraLarge}
          fontWeight={Fonts.regular}
          style={styles.username}>
          {username}
        </CustomText>
        <ImageActions 
          isVisible={showImageActions}
          onShowCamera={onShowCamera}
          onShowLibrary={onShowLibrary}
          onDeleteImage={onDeleteImage}
        />
        <CameraWidget 
          isVisible={showCamera}
          onSelectPhoto={onSelectPhoto} 
          onHideCamera={onHideCamera}
        />
        <PhotosLibraryWidget 
          isVisible={showLibrary} 
          onSelectPhoto={onSelectPhoto}
          onHideLibrary={onHideLibrary}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  username: {
    marginTop: 10,
    textAlign: 'center'
  }
});

export default ProfileScreen;