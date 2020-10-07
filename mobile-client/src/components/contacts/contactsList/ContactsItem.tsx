import React from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

import { Images } from '../../../../assets/assets';
import CustomText from '../../CustomText';
import { Colors, Fonts } from '../../../variables/variables';

type ContactsItemProps = {
  item: TContact;
  onContactSelect: (contact: TContact) => void;
};

const ContactsItem = ({ item, onContactSelect }: ContactsItemProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => onContactSelect(item)}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {item.profile ?
            <Image 
              style={styles.image} 
              source={{ uri: item.profile.cloudinaryImgPath_150 }}
            /> : 
            <Image style={styles.image} source={ Images.avatarSmall } />
          }
        </View>                  
        <CustomText 
          style={styles.name}
          color={Colors.primaryOrange} 
          fontWeight={Fonts.semiBold}
        >
          {item.username}
        </CustomText>
        {/* {onlineContacts.includes(rowData.item.username) && (
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
    paddingVertical: 6, 
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    backgroundColor: Colors.white
  },
  imageContainer: {
    overflow: 'hidden', 
    backgroundColor: Colors.lightGrey, 
    width: 44, 
    height: 44, 
    borderRadius: 22
  },
  image: {
    width: '100%', 
    height: '100%' 
  },
  name: {
    marginLeft: 20
  }
});

export default ContactsItem;

