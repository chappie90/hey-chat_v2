import React from 'react';
import { 
  View, 
  StyleSheet,
  Image
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Images } from '../../../../assets/assets';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import { Colors, Headings } from '../../../variables/variables';

type Contact = {
  _id: number;
  username: string;
};

type SearchItemProps = {
  item: Contact,
  onAddContact: (contactId: number) => void;
};

const SearchItem = ({ item, onAddContact }: SearchItemProps) => {
  return (
    <View style={styles.item}>
      <View style={styles.userDetails}>
        <View style={styles.imageContainer}>
          {item.profile ?
            <Image 
              style={styles.image} 
              source={{ uri: item.profile.cloudinaryImgPath_150 }}
              /> : 
            <Image style={styles.image} source={ Images.avatarSmall } />
          }
        </View>           
        <CustomText>{item.username}</CustomText>  
      </View> 
      <CustomButton
        color={Colors.secondaryGreen}
        buttonSize="small"
        textFontSize={Headings.headingSmall}
        onPress={() => onAddContact(item._id)}
      >
          <MaterialIcon name="message" size={25} color={Colors.white} /> 
          Message
      </CustomButton>    
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: 6, 
    paddingHorizontal: 15,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    marginRight: 10,
    backgroundColor: Colors.lightGrey
  },
  image: {
    width: '100%', 
    height: '100%'
  }
});

export default SearchItem;

