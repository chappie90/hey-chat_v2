import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Context as AuthContext } from '../context/AuthContext';
import { Colors, Headings, Fonts } from '../variables/variables';
import CustomText from '../components/CustomText';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileImage from '../components/profile/ProfileImage';
import ImageActions from '../components/profile/ImageActions';

type ProfileScreenProps = BottomTabScreenProps<MainStackParams, 'Profile'>;

const ProfileScreen = ({ }: ProfileScreenProps) => {
  const { state: { username, userId, socketState }, signOut } = useContext(AuthContext);
  const [showImageActions, setShowImageActions] = useState(false);

  const onSignOut = (): void => {
    signOut(userId, socketState);  
  }; 

  const onToggleImageActions = (): void => {
    setShowImageActions(!showImageActions);
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
      <ImageActions isVisible={showImageActions} onToggleImageActions={onToggleImageActions} />
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
  },
});

export default ProfileScreen;