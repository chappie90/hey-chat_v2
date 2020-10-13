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
      <View style={styles.top}>
        <CustomText color={Colors.white} fontSize={Headings.headingLarge}>My Contacts</CustomText>
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <FontAwesome5 name="user-plus" size={Headings.headingBig} color={Colors.white} />
        </TouchableOpacity>
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
    marginBottom: -70
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 11
  },
  addButton: {
    marginTop: 10
  },
  bottom: {
    height: 70,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35
  }
});

export default ContactsHeader;

