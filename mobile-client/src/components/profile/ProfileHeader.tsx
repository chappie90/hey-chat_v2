import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Colors, Fonts, Headings } from '../../variables/variables';
import CustomText from '../../components/CustomText';

type ProfileHeaderProps = { onSignOut: () => void };

const ProfileHeader = ({ onSignOut }: ProfileHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.top}>
        <CustomText 
          color={Colors.white} 
          fontWeight={Fonts.semiBold} 
          fontSize={Headings.headingLarge}
        >
          My Account
        </CustomText>
        <TouchableOpacity style={styles.signoutButton} onPress={() => onSignOut()}>
          <CustomText 
            fontSize={Headings.headingSmall} 
            fontWeight={Fonts.semiBold} 
            color={Colors.white}
          >
            Sign Out
          </CustomText>
        </TouchableOpacity>
      </View>
      <View style={styles.bottom}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.yellowDark,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginBottom: -70
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: 20,
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 11
  },
  signoutButton: {
    marginTop: 7
  },
  bottom: {
    height: 70,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35
  },
});

export default ProfileHeader;

