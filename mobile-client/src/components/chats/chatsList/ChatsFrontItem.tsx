import React from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import Octicon from 'react-native-vector-icons/Octicons';

import { API_BASE_URL } from '@env';
import { Images } from '../../../../assets/assets';
import CustomText from '../../CustomText';
import { Colors, Fonts, Headings } from '../../../variables/variables';
import { formatDate } from '../../../helpers/formatDate';

type ChatsFrontItemProps = {
  chat: TChat;
  contact?: TContact;
  onChatSelect: (chat: TChat, contact?: TContact) => void;
};

const ChatsFrontItem = ({ chat, contact, onChatSelect }: ChatsFrontItemProps) => {

  // console.log(chat)
  // console.log(contact)

  // const renderLastMessageText = (item) => {
  //   if (isTyping && typingUser == item.contact) {
  //     return 'is typing...';
  //   } else if (item.groupOwner && item.groupOwner === username) {
  //     return item.text.replace(username, 'You');
  //   } else if (!item.text) {
  //       if (item.from === username) {
  //         return 'You sent a photo'; 
  //       } else {
  //         return `${item.from} sent a photo`; 
  //       }  
  //   } else {
  //     return item.text
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={() => onChatSelect(chat, contact)}>
      <View>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            {contact?.profile?.image?.small.path ? (
              <Image 
                source={{ uri: `${API_BASE_URL}/${contact.profile.image.small.path}` }} 
                style={styles.image} 
              />
            ) : (
              <Image
                source={chat.type === 'private' ? Images.avatarSmall : Images.avatarGroupSmall } 
                style={styles.image} />
            )}
          </View>
          <View style={styles.chatDetailsContainer}>
            <View style={styles.itemContainer}>
              <CustomText 
                fontWeight={Fonts.semiBold} 
                numberOfLines={1} 
                style={styles.name}
              >
                {chat.type === 'private' ? contact?.username : 'groupName'}
              </CustomText>
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>  
                <CustomText 
                  color={Colors.greyDark}
                  fontSize={11}
                >
                  {formatDate(chat.createDate)}
                </CustomText>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <CustomText
                numberOfLines={2}
                ellipsize="tail"
                fontSize={13}
                fontWeight={false ? Fonts.semiBold : Fonts.regular}
                style={styles.messageText}
              >
                Some very very long even longer bless bless damnnnn bit more message text yeaahh baby
              </CustomText>
               {!chat.muted && (
                  <View>
                    <Octicon style={{marginLeft: 5}} name="mute" size={20} color={Colors.purpleDark} />
                  </View>
                )}
              {/* {rowData.item.unreadMessageCount !== 0 && ( */}
                <View style={styles.unreadBadge}>
                  <CustomText 
                    color={Colors.white}
                    fontWeight={Fonts.semiBold} 
                    fontSize={12}
                  >
                    7
                    {/* {rowData.item.unreadMessageCount > 99 ? '99+' : rowData.item.unreadMessageCount } */}
                  </CustomText>
                </View>
              {/* )} */}
            </View>
          </View>
          <View style={styles.divider} />
        </View>
        {/* {onlineContacts.includes(rowData.item.contact) && ( */}
          <View style={styles.isOnlineBadge} />
        {/* )}   */}
        </View>
      </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 5,
    backgroundColor: Colors.white
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 60, 
    height: 60, 
    borderRadius: 15, 
    backgroundColor: Colors.greyLight
  },
  image: {
    width: '100%', 
    height: '100%'
  },
  chatDetailsContainer: {
    flex: 1, 
    marginLeft: 15, 
    height: 74, 
    justifyContent: 'flex-start' 
  },  
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    maxWidth: '55%',
    marginBottom: 4
  },
  messageText: {
    maxWidth: '84%'
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 20, 
    right: 20,
    height: 1,
    backgroundColor: Colors.greyLight
  },
  isOnlineBadge: {
    backgroundColor: Colors.greenLight, 
    width: 15, 
    height: 15, 
    borderRadius: 7, 
    borderWidth: 2, 
    borderColor: Colors.white,
    position: 'absolute', 
    bottom: 9, 
    left: 16
  },
  unreadBadge: {
    backgroundColor: Colors.yellowDark,
    borderRadius: 10,
    paddingHorizontal: 5.5,
    paddingVertical: 0.6
  }
});

export default ChatsFrontItem;

