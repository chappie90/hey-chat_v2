import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import config from 'react-native-config';

import CustomText from 'components/CustomText';
import CustomButton from 'components/CustomButton';
import { Images } from 'assets';
import { Fonts, Colors, Headings } from 'variables';

const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/medium`;

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
            source={{ uri: `${S3_BUCKET_PATH}/${contactProfile}` }}
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
      <CustomButton color={Colors.yellowDark} onPress={onGreeting}>
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
    backgroundColor: Colors.greyLight
  },
  image: {
    width: '100%', 
    height: '100%'
  },
  contact: {
    marginBottom: 30
  }
});

export default ContactInvitation;