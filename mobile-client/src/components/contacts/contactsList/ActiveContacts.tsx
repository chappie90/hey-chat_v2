import React from 'react';
import { 
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList
} from 'react-native';

import { Images } from '../../../../assets/assets';
import { Colors, Fonts, Headings } from '../../../variables/variables';
import CustomText from '../../../components/CustomText';

type ActiveContactsProps = {
  contacts: Contact[];
  activeUsersCount: number;
};

const ActiveContacts = ({ contacts, activeUsersCount }: ActiveContactsProps) => {

  if (activeUsersCount === 0) {
    return <CustomText style={styles.noResults}>No active users</CustomText>;
  }

  return (
    <FlatList
      // refreshControl={
      //   <RefreshControl
      //     onRefresh={() => getContacts({ username })}
      //     refreshing={isLoading}
      //     tintColor={Colors.primaryOrange} />
      // }
      data={contacts}
      //   onEndReached={() => {
      //   if (localContacts.length < contacts.length) {
      //     loadMoreContacts();
      //   }
      // }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
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
              style={styles.row}
            >
              <View style={{ overflow: 'hidden', backgroundColor: '#F0F0F0', width: 44, height: 44, borderRadius: 22}}>
                {item.profile ?
                  <Image 
                    style={{ width: '100%', height: '100%' }} 
                    placeholderStyle={styles.placeholder}
                    source={{ uri: item.profile.cloudinaryImgPath_150 }}
                  /> : 
                  <Image 
                    style={{ width: '100%', height: '100%' }} 
                    source={ Images.avatarSmall } 
                  />
                }
              </View>                  
              <View style={styles.itemContainer}>
                <CustomText style={styles.name} fontWeight={Fonts.semiBold}>
                  {item.username}
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
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 6, 
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    backgroundColor: Colors.white
  },
  noResults: {
    textAlign: 'center',
    marginTop: 15
  }
});

export default ActiveContacts;

