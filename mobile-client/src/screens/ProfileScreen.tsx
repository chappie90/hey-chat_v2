import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { MainStackParams } from '../navigation/types';
import { Colors, Headings } from '../variables/variables';
import { Context as AuthContext } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';

type ProfileScreenProps = BottomTabScreenProps<MainStackParams, 'Profile'>;

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { state: { username, userId }, signout } = useContext(AuthContext);

  const onSignout = (): void => {
    signout(userId, navigation)
      .then(response => console.log('Profile ' + response));   
  }; 

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.innerContainer}>
        <View style={styles.signout}>
          <CustomButton textFontSize={Headings.headingBig} onPress={onSignout}>
            Sign Out
          </CustomButton>
        </View>
        <CustomText fontSize={Headings.headingExtraLarge} style={styles.username}>
          {username}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  background: {
    width: '100%',
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: 0,
    left: 0,
    height: 200
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 20
  },
  signout: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingBottom: 30
  },
  username: {
    marginTop: 10,
    textAlign: 'center'
  },
});

export default ProfileScreen;