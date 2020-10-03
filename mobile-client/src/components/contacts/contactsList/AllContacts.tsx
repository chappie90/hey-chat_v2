import React from 'react';
import { 
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Images } from '../../../../assets/assets';
import { Colors, Fonts, Headings } from '../../../variables/variables';
import CustomText from '../../../components/CustomText';

type Contact = {
  _id: number;
  username: string;
};

type AllContactsProps = {
  contacts: Contact[];
};

const AllContacts = ({ contacts }: AllContactsProps) => {
  return (
    <SwipeListView
      // refreshControl={
      //   <RefreshControl
      //     onRefresh={() => getContacts({ username })}
      //     refreshing={isLoading}
      //     tintColor={Colors.primary} />
      // }
      disableRightSwipe
      data={contacts}
      //   onEndReached={() => {
      //   if (localContacts.length < contacts.length) {
      //     loadMoreContacts();
      //   }
      // }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={ (rowData, rowMap) => {
        // const chat = previousChats.filter(c => c.contact === rowData.item.user.username);
        return (
          <TouchableWithoutFeedback 
            onPress={() => {
              // navigation.navigate('ChatDetail', {
              //   username: rowData.item.user.username,
              //   image: rowData.item.user.profile ? rowData.item.user.profile.cloudinaryImgPath_150 : '',
              //   type: 'private',
              //   chatId: chat.length > 0 ? chat[0].chatId : null,
              //   origin: 'ContactsList'
              // })
            }}>
            <View 
              style={styles.rowFront}
            >
              <View style={{ overflow: 'hidden', backgroundColor: '#F0F0F0', width: 44, height: 44, borderRadius: 22}}>
                {rowData.item.profile ?
                  <Image 
                    style={{ width: '100%', height: '100%' }} 
                    placeholderStyle={styles.placeholder}
                    source={{ uri: rowData.item.profile.cloudinaryImgPath_150 }}
                  /> : 
                  <Image 
                    style={{ width: '100%', height: '100%' }} 
                    source={ Images.avatarSmall } 
                  />
                }
              </View>                  
              <View style={styles.itemContainer}>
                <CustomText style={styles.name} fontWeight={Fonts.semiBold}>
                  {rowData.item.username}
                </CustomText>
              </View>
              {/* {onlineContacts.includes(rowData.item.username) && (
                <Badge
                  badgeStyle={styles.badge}
                  containerStyle={styles.badgeContainer}
                />
              )}   */}
            </View>
          </TouchableWithoutFeedback>
        );
      }}
      renderHiddenItem={ (rowData, rowMap) => (
        <View style={styles.rowBack}>
          <TouchableOpacity style={{ }} onPress={() => {}}>
            <View style={styles.deleteIcon}>
              <EntypoIcon name="trash" size={24} color={Colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      )}
      rightOpenValue={-65}
    />
  );
};

const styles = StyleSheet.create({
  rowFront: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 6, 
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    backgroundColor: Colors.white
  },
  rowBack: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  deleteIcon: {
    backgroundColor: Colors.tertiary,
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center' 
  }
});

export default AllContacts;

