import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Colors, Headings, Fonts } from '../variables/variables';
import { Context as AuthContext } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';

type ProfileScreenProps = BottomTabScreenProps<MainStackParams, 'Profile'>;

const ProfileScreen = ({ }: ProfileScreenProps) => {
  const { state: { username, userId, socketState }, signout } = useContext(AuthContext);

  const onSignout = (): void => {
    signout(userId, socketState);  
  }; 

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.innerContainer}>
        <View style={styles.signout}>
          <CustomButton 
            textFontSize={Headings.headingBig} 
            buttonSize="small" 
            onPress={onSignout}
            >
            Sign Out
          </CustomButton>
        </View>
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
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white
  },
  background: {
    width: '100%',
    backgroundColor: Colors.primaryOrange,
    position: 'absolute',
    top: 0,
    left: 0,
    height: 250
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 10
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