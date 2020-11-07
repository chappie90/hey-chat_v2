import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import api from '../api/api';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ProfileContext } from '../context/ProfileContext';
import { Colors, Headings, Fonts } from '../variables/variables';
import CustomText from '../components/CustomText';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileImage from '../components/profile/ProfileImage';
import ImageActions from '../components/profile/ImageActions';
import CameraWidget from '../components/camera/CameraWidget';
import PhotosLibraryWidget from '../components/camera/PhotosLibraryWidget';

type ProfileScreenProps = BottomTabScreenProps<MainStackParams, 'Profile'>;

const ProfileScreen = ({ }: ProfileScreenProps) => {
  const { state: { username, userId, socketState }, signOut } = useContext(AuthContext);
  const { getProfileImage, updateProfileImage } = useContext(ProfileContext);
  const [showImageActions, setShowImageActions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const onSignOut = (): void => {
    signOut(userId, socketState);  
  }; 

  const onToggleImageActions = (): void => {
    setShowImageActions(!showImageActions);
  };

  const hideImageActions = (): void => {
    setShowImageActions(false);
  };

  const onShowCamera = (): void => {
    setShowCamera(true);
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
  };

  const onHideLibrary = (): void => {
    setShowLibrary(false);
    hideImageActions();
  };

  const uploadProfileImage = async (imageData: TCameraPhoto): Promise<void> => {
    let imageUri;

    if (imageData.filename) {
      imageUri = `${imageData.uri}/${imageData.filename}}`;
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

    const response = await api.post('/image/upload', data);

    updateProfileImage(response.data.profileImage);
  };

  useEffect(() => {
    getProfileImage(userId);
  }, []);

  return (
    <View style={styles.container}>
      <ProfileHeader onSignOut={onSignOut} />
      <ProfileImage onToggleImageActions={onToggleImageActions} />
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