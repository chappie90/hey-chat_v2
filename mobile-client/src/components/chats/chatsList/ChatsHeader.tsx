import React from 'react';
import { 
  View, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Colors, Headings } from '../../../variables/variables';
import CustomText from '../../../components/CustomText';

type ChatsHeaderProps = {
  openModal: () => void;
};

const ChatsHeader = ({ openModal }: ChatsHeaderProps) => {
  return (
    <View style={styles.header}>
      <CustomText color={Colors.white} fontSize={Headings.headingLarge}>My Chats</CustomText>
      <TouchableOpacity style={styles.addButton} onPress={openModal}>
        <MaterialIcon name="group-add" size={37} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.yellowDark,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingRight: 20,
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 5
  },
  addButton: {
    marginTop: 2
  }
});

export default ChatsHeader;

