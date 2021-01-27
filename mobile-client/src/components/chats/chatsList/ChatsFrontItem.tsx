import React from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import Octicon from 'react-native-vector-icons/Octicons';
import config from 'react-native-config';
import { useSelector } from 'react-redux';

import { Images } from 'assets';
import CustomText from 'components/CustomText';
import { Colors, Fonts } from 'variables';
import { formatDate } from 'utils/formatDate';

type ChatsFrontItemProps = {
  chat: TChat;
  contact?: TContact;
  onChatSelect: (chat: TChat, contact?: TContact) => void;
};

const ChatsFrontItem = ({ chat, contact, onChatSelect }: ChatsFrontItemProps) => {
  const { typingContacts } = useSelector(state => state.chats);
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/small`;

  return (
    <TouchableWithoutFeedback onPress={() => onChatSelect(chat, contact)}>
      <View>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            {contact?.avatar?.small ? (
              <Image 
                source={{ uri: `${S3_BUCKET_PATH}/${contact.avatar.small}` }} 
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
                fontWeight={chat.unreadMessagesCount > 0 ? Fonts.bold : Fonts.regular}
                style={styles.messageText}
              >
                {typingContacts.includes(contact?._id) ? 'is typing...' : chat.lastMessage.message.text}
              </CustomText>
               {chat.muted && (
                  <Octicon 
                    style={styles.muteIcon} 
                    name="mute" 
                    size={20} 
                    color={Colors.purpleDark} 
                  />
                )}
              {chat.unreadMessagesCount > 0 && (
                <View style={styles.unreadBadge}>
                  <CustomText 
                    color={Colors.white}
                    fontWeight={Fonts.semiBold} 
                    fontSize={12}
                  >
                    {chat.unreadMessagesCount > 99 ? '99+' : chat.unreadMessagesCount }
                  </CustomText>
                </View>
              )}
            </View>
          </View>
          <View style={styles.divider} />
        </View>
        {chat.online && <View style={styles.isOnlineBadge} />}
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
    maxWidth: '84%',
    flex: 1
  },
  muteIcon: {
    marginHorizontal: 5
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
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    borderWidth: 2, 
    borderColor: Colors.white,
    position: 'absolute', 
    bottom: 8, 
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

