import React from 'react';
import { 
  View, 
  StyleSheet,
  Image
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import config from 'react-native-config';

import { Images } from 'assets';
import CustomButton from 'components/CustomButton';
import CustomText from 'components/CustomText';
import { Colors, Fonts, Headings } from 'variables';

type SearchItemProps = {
  item: TContact,
  onSendMessage: (Contact: TContact) => void;
};

const SearchItem = ({ item, onSendMessage }: SearchItemProps) => {
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/small`;

  return (
    <View style={styles.item}>
      <View style={styles.userDetails}>
        <View style={styles.imageContainer}>
          {item.avatar ?
            <Image 
              style={styles.image} 
              source={{ uri: `${S3_BUCKET_PATH}/${item.avatar.small}` }}
              /> : 
            <Image style={styles.image} source={ Images.avatarSmall } />
          }
        </View>           
        <CustomText fontWeight={Fonts.semiBold}>{item.username}</CustomText>  
      </View> 
      <CustomButton
        color={Colors.purpleDark}
        buttonSize="small"
        textFontSize={Headings.headingExtraSmall}
        onPress={() => onSendMessage(item)}
      >
        Send
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
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.purpleLight
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    marginRight: 20,
    backgroundColor: Colors.greyLight
  },
  image: {
    width: '100%', 
    height: '100%'
  }
});

export default SearchItem;

