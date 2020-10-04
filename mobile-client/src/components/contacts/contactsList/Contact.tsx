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

type IContact = {
  _id: number;
  username: string;
};

type ContactProps = {

};

const Contact = ({ item, onAddContact }: ContactProps) => {
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
});

export default Contact;

