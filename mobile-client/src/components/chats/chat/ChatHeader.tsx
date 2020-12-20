import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import config from 'react-native-config';
import { useSelector } from 'react-redux';

import CustomText from 'components/CustomText';
import { Images } from 'assets';
import { Colors, Fonts } from 'variables';

type ChatHeaderProps = {
  chatType: string;
  contactId: number;
  contactName: string;
  contactProfile: string | undefined;
};

const ChatHeader = ({ chatType, contactId, contactName, contactProfile }: ChatHeaderProps) => {
  const { typingContacts } = useSelector(state => state.chats);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButton}>
            <MaterialCommunityIcon name="arrow-left" size={38} color={Colors.yellowDark} /> 
          </View>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {contactProfile?.image?.small.path ? (
            <Image 
              source={{ uri: `${config.RN_API_BASE_URL}/${contactProfile.image.small.path}` }} 
              style={styles.image} 
            />
          ) : (
            <Image
              source={chatType === 'private' ? Images.avatarSmall : Images.avatarGroupSmall } 
              style={styles.image} />
          )}
        </View>
        <CustomText fontWeight={Fonts.semiBold}>
          {contactName}
          {typingContacts.includes(contactId) && ' is typing...'}
        </CustomText>
      </View>
      <View style={styles.bottom}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.yellowLight,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginBottom: -35
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  bottom: {
    height: 60,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  backButton: {
    marginLeft: 20,
    marginRight: 10
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 44, 
    height: 44, 
    borderRadius: 15, 
    backgroundColor: Colors.greyLight,
    marginRight: 10
  },
  image: {
    width: '100%', 
    height: '100%'
  },
});

export default ChatHeader;

