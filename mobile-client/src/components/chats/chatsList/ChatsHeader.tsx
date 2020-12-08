import React from 'react';
import { 
  View, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Colors, Headings, Fonts } from 'variables';
import CustomText from 'components/CustomText';

type ChatsHeaderProps = {
  openModal: () => void;
};

const ChatsHeader = ({ openModal }: ChatsHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.top}>
        <CustomText 
          color={Colors.white} 
          fontSize={Headings.headingLarge}
          fontWeight={Fonts.semiBold}
        >
          My Chats
        </CustomText>
        {/* <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <MaterialIcon name="group-add" size={37} color={Colors.white} />
        </TouchableOpacity> */}
      </View>
      <View style={styles.bottom}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.yellowDark,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginBottom: -40
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 5
  },
  addButton: {
    marginTop: 2
  },
  bottom: {
    height: 70,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35
  }
});

export default ChatsHeader;

