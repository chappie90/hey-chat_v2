import React from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import Octicon from 'react-native-vector-icons/Octicons';

import { Images } from '../../../../assets/assets';
import CustomText from '../../CustomText';
import { Colors, Fonts } from '../../../variables/variables';

type ChatsFrontItemProps = {
  chat: TChat;
  contact?: TContact;
  onChatSelect: (chat: TChat, contact?: TContact) => void;
};

const ChatsFrontItem = ({ chat, contact, onChatSelect }: ChatsFrontItemProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => onChatSelect(chat, contact)}>
      <View>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            {chat.profile && chat.profile.imgPath ? (
              <Image source={{ uri: chat.profile.imgPath }} style={styles.image} />
            ) : (
              <Image
                source={chat.type === 'private' ? Images.avatarSmall : Images.avatarGroupSmall } 
                style={styles.image} />
            )}
          </View>
          <View style={styles.chatDetailsContainer}>
            <View style={styles.itemContainer}>
              <CustomText 
                color={chat.groupOwner ? Colors.secondaryGreen : Colors.primaryOrange}
                fontWeight={Fonts.semiBold} 
                numberOfLines={1} 
                style={styles.name}
              >
                {chat.type === 'private' ? contact.username : 'groupName'}
              </CustomText>
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>  
                <CustomText color={Colors.grey}>{chat.createDate}</CustomText>
                {chat.muted && (
                  <View>
                    <Octicon style={{marginLeft: 5}} name="mute" size={20} color={Colors.lightGrey} />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.itemContainer}>
              {/* <CustomText
                numberOfLines={2}
                ellipsize="tail"
                style={rowData.item.unreadMessageCount > 0 ? styles.unreadMessage : styles.text}>
                {renderLastMessageText(rowData.item)}
              </CustomText> */}
              {/* {rowData.item.unreadMessageCount !== 0 && (
                <View style={styles.unreadBadge}>
                  <CustomText fontWeight={Fonts.semiBold} style={styles.unreadBadgeText}>
                    {rowData.item.unreadMessageCount > 99 ? '99+' : rowData.item.unreadMessageCount }
                  </CustomText>
                </View>
              )} */}
            </View>
          </View>
          <View style={styles.divider} />
        </View>
        {/* {onlineContacts.includes(rowData.item.contact) && (
          <Badge
            badgeStyle={styles.badge}
            containerStyle={styles.badgeContainer}
          />
        )}   */}
        </View>
      </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 5,
    backgroundColor: Colors.white
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 56, 
    height: 56, 
    borderRadius: 4, 
    backgroundColor: Colors.lightGrey
  },
  image: {
    width: '100%', 
    height: '100%'
  },
  chatDetailsContainer: {
    flex: 1, 
    marginLeft: 10, 
    height: 70, 
    justifyContent: 'center' 
  },  
  name: {
    maxWidth: '55%'
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    marginHorizontal: 10, 
    width: '100%',
    height: 1,
    backgroundColor: Colors.lightGrey
  }
});

export default ChatsFrontItem;

