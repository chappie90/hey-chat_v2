import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import CustomText from '../../CustomText';
import CustomButton from '../../CustomButton';
import { Images } from '../../../../assets/assets';
import { Fonts, Colors, Headings } from '../../../variables/variables';

type ContactInvitationProps = {
  contactName?: string;
  contactProfile?: string;
  onGreeting: () => void;
};

const ContactInvitation = ({ contactName, contactProfile, onGreeting }: ContactInvitationProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {contactProfile ?
          <Image 
            style={styles.image} 
            source={{ uri: contactProfile }}
            /> : 
          <Image style={styles.image} source={ Images.avatarSmall } />
        }
      </View> 
      <CustomText 
        style={styles.contact} 
        fontWeight={Fonts.semiBold} 
        fontSize={Headings.headingBig}>
        {contactName}
      </CustomText>
      <CustomButton color={Colors.primaryOrange} onPress={onGreeting}>
        Say hi
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 10,
    backgroundColor: Colors.lightGrey
  },
  image: {
    width: '100%', 
    height: '100%'
  },
  contact: {
    marginBottom: 40
  }
});

export default ContactInvitation;