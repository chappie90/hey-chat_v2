import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import CustomText from 'components/CustomText';
import { Colors, Fonts, Headings } from 'variables';

type IncomingCallNotificationProps = {};

const IncomingCallNotification = ({ }: IncomingCallNotificationProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <CustomText 
          color={Colors.white} 
          fontSize={Headings.headingMedium} 
          fontWeight={Fonts.semiBold}
          style={{ marginBottom: 6 }}
        >
          Nora is calling...
        </CustomText>
        <CustomText color={Colors.white} fontSize={Headings.headingExtraSmall}>
          Hey Chat Video Call
        </CustomText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => console.log('rejected')}>
          <View style={styles.rejectButton}>
            <MaterialIcon color={Colors.purpleDark} name="close" size={28} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('accepted')}>
          <View style={styles.acceptButton}>
          <MaterialIcon color={Colors.white} name="check" size={26} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    top: -10,
  },
  actions: {
    flexDirection: 'row',
    top: -8
  },
  rejectButton: {
    backgroundColor: Colors.white,
    borderRadius: 40,
    width: 35,
    height: 35,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1
  },
  acceptButton: {
    backgroundColor: Colors.yellowDark,
    borderRadius: 40,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1
  }
});

export default IncomingCallNotification;
