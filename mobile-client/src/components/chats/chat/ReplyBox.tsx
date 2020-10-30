import React from 'react';
import { 
  View,
  StyleSheet, 
  TouchableOpacity,
  Image
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Colors, Fonts, Headings } from '../../../variables/variables';
import { Images } from '../../../../assets/assets';
import CustomText from '../../CustomText';

type ReplyBoxProps = {
  origMsgSenderName: string;
  origMsgSenderAvatar?: string;
  origMsg: string;
  onCloseReplyBox: () => void;
};

const ReplyBox = ({ 
  origMsgSenderName, 
  origMsgSenderAvatar, 
  origMsg, 
  onCloseReplyBox 
}: ReplyBoxProps) => {

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {origMsgSenderAvatar ?
          <Image 
            style={styles.image} 
            source={{ uri: origMsgSenderAvatar }}
            /> : 
          <Image style={styles.image} source={ Images.avatarSmall } />
        }
      </View>
      <View style={styles.messageDetails}>
        <CustomText 
          fontSize={Headings.headingExtraSmall} 
          color={Colors.greyDark}
          fontWeight={Fonts.semiBold}
        >
          {origMsgSenderName}
        </CustomText>
        <CustomText fontSize={Headings.headingExtraSmall} color={Colors.greyDark}>
          {origMsg}
        </CustomText>
      </View>
      <TouchableOpacity onPress={onCloseReplyBox}>
        <MaterialIcon name="close" size={34} color={Colors.purpleDark} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.purpleLight,
    position: 'absolute',
    bottom: 55,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 6
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: Colors.greyLight,
    marginRight: 15
  },
  image: {
    width: '100%', 
    height: '100%'
  },
  messageDetails: {
    flex: 1
  }
});

export default ReplyBox;
