import React, { useEffect, useRef, useContext } from 'react';
import { 
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
  Animated,
  Easing,
  ActionSheetIOS
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Octicon from 'react-native-vector-icons/Octicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { emitMarkAllMessagesAsRead } from 'socket/eventEmitters';
import { Colors, Fonts, Headings } from 'variables';
import CustomText from 'components/CustomText';
import ChatsFrontItem from './ChatsFrontItem';
import { chatsActions } from 'reduxStore/actions';

type ChatsListProps = {
  chats: TChat[];
};

const ChatsList = ({ chats }: ChatsListProps) => {
  const { userId, socketState } = useSelector(state => state.auth);
  const rowOpenValue = useRef(0);
  const isRowOpen = useRef(false);
  const rowTranslateAnimatedValues = useRef({}).current;
  const navigation = useNavigation();
  const screenWidth = useWindowDimensions().width;
  const dispatch = useDispatch();

  const onMuteChat = (chat: TChat) => {
    dispatch(chatsActions.muteChat(userId, chat.chatId, !chat.muted));
  };

  // const muteChatHandler = (rowKey, rowMap, selectedChat) => {
  //   openRowRefs.push(rowMap[rowKey]);
  //   toggleMuteChat(username, selectedChat.chatId, selectedChat.type, selectedChat.muted)
  //     .then(res => {
  //       // setPinAnimate(true);
  //       closeAllOpenRows();
  //     });
  // };

  const onRowOpen = (rowKey, rowMap, toValue) => {
    const listItem = chats[rowKey];
  };

  const onSwipeValueChange = (swipeData) => {
    const { key, value, isOpen } = swipeData;

    rowOpenValue.current = value;
    isRowOpen.current = false;

    if (value > 200) {
      Animated.timing(
        rowTranslateAnimatedValues[key].left,
        {
          toValue: value,
          duration: 50,
          easing: Easing.inOut(Easing.ease)
        },
      ).start();
      isRowOpen.current = true;
    } else if (value > 0) {
      rowTranslateAnimatedValues[key].left.setValue(value);
    } else if (value < -200) {
       Animated.timing(
        rowTranslateAnimatedValues[key].right,
        {
          toValue: Math.abs(value),
          duration: 50,
          easing: Easing.inOut(Easing.ease)
        },
      ).start();
       isRowOpen.current = true;
    } else if (value < 0) {
      rowTranslateAnimatedValues[key].right.setValue(Math.abs(value));
    } 

    // if (Math.abs(value) > 200 && isOpen) {
    //   onRowOpen();
    // }
  };

  const onChatSelect = (chat: TChat, contact?: TContact): void => {
    let routeParams;

    if (chat.type === 'private') {
      if (contact) {
        // Send signal to sender message has been read and mark recipient's chat as read
        dispatch(chatsActions.markMessagesAsReadRecipient(chat.chatId));
        const eventData = { chatId: chat.chatId, senderId: contact._id };
        emitMarkAllMessagesAsRead(JSON.stringify(eventData), socketState);

        routeParams = {
          chatType: chat.type,
          chatId: chat.chatId,
          contactName: contact.username,
          contactId: contact._id
        };
      }
    }
    
    if (chat.type === 'group') {

    }

    navigation.navigate('CurrentChat', routeParams);
  };

  useEffect(() => {
    if (Object.keys(rowTranslateAnimatedValues).length !== chats.length) {
      chats.forEach((item, index) => {
        rowTranslateAnimatedValues[`${index}`] = { left: new Animated.Value(0), right: new Animated.Value(0) };
      });
    }
 }, [chats]);

  return (
    <SwipeListView
      // refreshControl={
      //   <RefreshControl
      //     onRefresh={() => getChats({ username })}
      //     refreshing={isLoading}
      //     tintColor={Colors.primaryOrange} />
      // }
      data={chats}
      //   onEndReached={() => {
      //   if (localContacts.length < contacts.length) {
      //     loadMoreContacts();
      //   }
      // }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={ (rowData, rowMap) => {
        let contact: TContact | undefined;
        if (rowData.item.type === 'private') {
          contact = rowData.item.participants.filter(p => p._id !== userId)[0];
        }
        return (
          <ChatsFrontItem chat={rowData.item} contact={contact} onChatSelect={onChatSelect} />
      )}}
      renderHiddenItem={ (data, rowMap) => {
        return (
          <View style={styles.rowBack}>
            <View style={[
              styles.muteBtnContainer,
              { backgroundColor: data.item.muted ? Colors.greyDark : Colors.greyLight } 
            ]}>
              <TouchableOpacity style={{ }} onPress={() => onMuteChat(data.item)}>
                <Animated.View style={[
                  styles.rowBackAnimatedView,
                  { transform: [
                     { translateX: rowTranslateAnimatedValues[`${data.index}`] ? (rowTranslateAnimatedValues[`${data.index}`].left.interpolate({
                       inputRange: [0, 25, 50, 75, 100, 150, 200, screenWidth / 2 + 70],
                       outputRange: [-20, -10, 0, 8.5, 19, 27, 29, screenWidth / 2 + 70],
                       extrapolate: 'clamp'
                     })) : (new Animated.Value(0)) 
                     }
                   ] }
                ]}>
                   {data.item.muted ? 
                     <Octicon name="unmute" size={28} color={Colors.white} />:
                     <Octicon name="mute" size={28} color={Colors.white} />}
                   {data.item.muted ? 
                      <CustomText 
                        color={Colors.white} 
                        fontWeight={Fonts.semiBold}
                        fontSize={Headings.headingExtraSmall} 
                        style={{ flex: 1 }}
                      >
                        Unmute
                      </CustomText> :
                      <CustomText 
                        color={Colors.white} 
                        fontWeight={Fonts.semiBold}
                        fontSize={Headings.headingExtraSmall} 
                        style={{ flex: 1 }}
                      >
                        Mute
                      </CustomText>}
                 </Animated.View>
               </TouchableOpacity>
            </View>
            <View style={styles.deleteBtnContainer}>
              <TouchableOpacity style={{ }} onPress={() => {deleteRow(data.index, rowMap, data.item)}}>
                <Animated.View style={[
                  styles.rowBackAnimatedView,
                  { transform: [
                    { translateX: rowTranslateAnimatedValues[`${data.index}`] ? (rowTranslateAnimatedValues[`${data.index}`].right.interpolate({
                        inputRange: [0, 25, 50, 75, 100, 150, 200, screenWidth / 2 + 70],
                        outputRange: [20, 10, 0, -8.5, -19, -27, -29, -screenWidth / 2 - 60],
                        extrapolate: 'clamp'
                    })) : (new Animated.Value(0)) 
                    }
                  ] }
                ]}>
                    <EntypoIcon name="trash" size={24} color={Colors.white} />
                    <CustomText 
                      color={Colors.white} 
                      fontWeight={Fonts.semiBold}
                      fontSize={Headings.headingExtraSmall} 
                      style={{ flex: 1 }}
                    >
                      Delete
                    </CustomText>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
       )}}
      leftOpenValue={66}
      rightOpenValue={-66}
      stopLeftSwipe={screenWidth / 2}
      stopRightSwipe={-screenWidth / 2}
      onSwipeValueChange={onSwipeValueChange}
      onRowOpen={onRowOpen}
      tension={30} 
    />
  );
};

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  muteBtnContainer: {
    width: '50%', 
    height: '100%',
    justifyContent: 'center'
  },
  deleteBtnContainer: {
    backgroundColor: Colors.red, 
    width: '50%', 
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  rowBackAnimatedView: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ChatsList;
