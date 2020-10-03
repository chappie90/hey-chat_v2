import React from 'react';
import { 
  View, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Colors, Headings } from '../../../variables/variables';
import CustomText from '../../../components/CustomText';

type ContactsHeaderProps = {
  openModal: () => void;
};

const ContactsHeader = ({ openModal }: ContactsHeaderProps) => {
  return (
    <View style={styles.header}>
      <CustomText color={Colors.white} fontSize={Headings.headingLarge}>My Contacts</CustomText>
      <TouchableOpacity style={styles.addButton} onPress={openModal}>
        <FontAwesome5 name="user-plus" size={Headings.headingBig} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingRight: 15,
    paddingLeft: 20,
    paddingTop: 65,
    paddingBottom: 10,
    height: 110
  },
  addButton: {
    marginTop: 10
  }
});

export default ContactsHeader;

