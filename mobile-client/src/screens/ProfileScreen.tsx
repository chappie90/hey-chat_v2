import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Context as AuthContext } from '../context/AuthContext';
import { Colors, Headings, Fonts } from '../variables/variables';
import CustomText from '../components/CustomText';
import ProfileHeader from '../components/profile/ProfileHeader';

type ProfileScreenProps = BottomTabScreenProps<MainStackParams, 'Profile'>;

const ProfileScreen = ({ }: ProfileScreenProps) => {
  const { state: { username, userId, socketState }, signOut } = useContext(AuthContext);

  const onSignOut = (): void => {
    signOut(userId, socketState);  
  }; 

  return (
    <View style={styles.container}>
      <ProfileHeader onSignOut={onSignOut} />
      <View style={styles.innerContainer}>
        <CustomText 
          fontSize={Headings.headingExtraLarge}
          fontWeight={Fonts.regular}
          style={styles.username}>
          {username}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 10
  },
  username: {
    marginTop: 10,
    textAlign: 'center'
  },
});

export default ProfileScreen;