import React from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

import { Images } from 'assets';
import CustomText from 'components/CustomText';
import { Colors, Fonts, Headings } from 'variables';

type ContactsItemProps = {
  item: TContact;
  onContactSelect: (contact: TContact) => void;
};

const ContactsItem = ({ item, onContactSelect }: ContactsItemProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => onContactSelect(item)}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {item.avatar ?
            <Image 
              style={styles.image} 
              source={{ uri: item.avatar.small }}
            /> : 
            <Image style={styles.image} source={ Images.avatarSmall } />
          }
        </View>                  
        <CustomText 
          style={styles.name}
          fontWeight={Fonts.semiBold}
        >
          {item.username}
        </CustomText>
        {item.pending && 
          <CustomText style={styles.status} color={Colors.greyLight} fontSize={Headings.headingSmall}>
            Pending...
          </CustomText>
        } 
        {item.online && <View style={styles.isOnlineBadge} />}
        <View style={styles.divider} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 6, 
    paddingHorizontal: 35,
    backgroundColor: Colors.white
  },
  imageContainer: {
    overflow: 'hidden', 
    backgroundColor: Colors.greyLight, 
    width: 44, 
    height: 44, 
    borderRadius: 15
  },
  image: {
    width: '100%', 
    height: '100%' 
  },
  name: {
    marginLeft: 20
  },
  status: {
    marginLeft: 'auto'
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 30, 
    right: 30,
    height: 1,
    backgroundColor: Colors.greyLight
  },
  isOnlineBadge: {
    backgroundColor: Colors.greenLight, 
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    borderWidth: 2, 
    borderColor: Colors.white,
    position: 'absolute', 
    bottom: 4, 
    left: 30
  },
});

export default ContactsItem;

