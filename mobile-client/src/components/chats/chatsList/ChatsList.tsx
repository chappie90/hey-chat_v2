import React, { useEffect, useRef } from 'react';
import { 
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  RefreshControl,
  useWindowDimensions,
  Animated,
  Easing
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Octicon from 'react-native-vector-icons/Octicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

import { Images } from '../../../../assets/assets';
import { Colors, Fonts, Headings } from '../../../variables/variables';
import CustomText from '../../../components/CustomText';

type ChatsListProps = {
  chats: Chat[];
};

const ChatsList = ({ chats }: ChatsListProps) => {
  const rowOpenValue = useRef(0);
  const isRowOpen = useRef(false);
  const rowTranslateAnimatedValues = useRef({}).current;
  const navigation = useNavigation();
  const screenWidth = useWindowDimensions().width;

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
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              // markMessagesAsRead({ username, recipient: rowData.item.contact });
              // if (rowData.item.type === 'group') {
              //   getCurrentGroupId(rowData.item.chatId);
              // }
              navigation.navigate('CurrentChat', {    
                chatType: rowData.item.type,
                chatId: rowData.item._id,
                contactName: rowData.item.contact,    
              });
          }}>
          <View>
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                { rowData.item.profile && rowData.item.profile.imgPath ? (
                  <Image source={{ uri: rowData.item.profile.imgPath }} style={styles.image} />
                ) : (
                  <Image
                    source={rowData.item.type === 'private' ? Images.avatarSmall : Images.avatarGroupSmall } 
                    style={styles.image} />
                )}
              </View>
              <View style={styles.chatDetailsContainer}>
                <View style={styles.itemContainer}>
                  <CustomText 
                    fontWeight={Fonts.semiBold} 
                    numberOfLines={1} 
                    style={rowData.item.groupOwner ? styles.groupName : styles.name}
                  >
                    {rowData.item.contact}
                  </CustomText>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>  
                    <CustomText style={styles.date}>{rowData.item.date}</CustomText>
                    {rowData.item.muted && (
                      <View>
                        <Octicon style={{marginLeft: 5}} name="mute" size={20} color='lightgrey' />
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
      )}}
      renderHiddenItem={ (data, rowMap) => {
        return (
          <View style={styles.rowBack}>
            <View style={[
              styles.muteBtnContainer,
              { backgroundColor: data.item.muted ? Colors.secondaryGreen : Colors.grey } 
            ]}>
              <TouchableOpacity style={{ }} onPress={() => muteChatHandler(data.index, rowMap, data.item)}>
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
  divider: {
    position: 'absolute',
    bottom: 0,
    marginHorizontal: 10, 
    width: '100%',
    height: 1,
    backgroundColor: Colors.lightGrey
  },
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
    backgroundColor: Colors.tertiaryRed, 
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
