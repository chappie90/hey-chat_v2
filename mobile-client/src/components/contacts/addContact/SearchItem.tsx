import React from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  TouchableOpacity
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
  item: Contact
};

const SearchItem = ({ item }: SearchItemProps) => {
  return (
    <View style={styles.item}>
      <View style={styles.userDetails}>
        <View style={styles.imageContainer}>
          {item.profile ?
            <Image 
              style={{ width: '100%', height: '100%' }} 
              source={{ uri: item.profile.cloudinaryImgPath_150 }}
              /> : 
            <Image style={{ width: '100%', height: '100%' }} source={ Images.avatarSmall } />
          }
        </View>           
        <CustomText>{item.username}</CustomText>  
      </View> 
      <CustomButton
        color={Colors.secondary}
        buttonSize="small"
        textFontSize={Headings.headingSmall}
        onPress={() => onAddContact(userId, item._id)}>
          Add
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
  }
});

export default SearchItem;

