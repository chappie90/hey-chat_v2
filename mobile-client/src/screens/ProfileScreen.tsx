import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Context as AuthContext } from '../context/AuthContext';
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
  const [showImageActions, setShowImageActions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const onSignOut = (): void => {
    signOut(userId, socketState);  
  }; 

  const onToggleImageActions = (): void => {
    setShowImageActions(!showImageActions);
  };

  const onShowCamera = () => {
    setShowCamera(true);
  };

  const onHideCamera = () => {
    setShowCamera(false);
  };

  const onSelectPhoto = (photoData: TCameraPhoto): TCameraPhoto => {
    return photoData;
  };

  const onShowLibrary = () => {
    setShowLibrary(true);
  };

  const onHideLibrary = () => {
    setShowLibrary(false);
  };

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