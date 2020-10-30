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
  originalMessage: TMessage;
  onCloseReplyBox: () => void;
};

const ReplyBox = ({ 
  originalMessage,
  onCloseReplyBox 
}: ReplyBoxProps) => {
  const { sender, text } = originalMessage;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {sender.avatar ?
          <Image 
            style={styles.image} 
            source={{ uri: sender.avatar }}
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
          {sender._id === 1 ? 'You' : sender.name}
        </CustomText>
        <CustomText fontSize={Headings.headingExtraSmall} color={Colors.greyDark}>
          {text}
        </CustomText>
      </View>
      <TouchableOpacity style={styles.closeBtn} onPress={onCloseReplyBox}>
        <MaterialIcon name="close" size={32} color={Colors.purpleDark} />
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
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    backgroundColor: Colors.greyLight,
    borderWidth: 3,
    borderColor: Colors.purpleDark,
    marginRight: 15,
    alignSelf: 'flex-start'
  },
  image: {
    width: '100%', 
    height: '100%'
  },
  messageDetails: {
    flex: 1
  },
  closeBtn: {
    alignSelf: 'flex-start'
  }
});

export default ReplyBox;
