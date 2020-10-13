import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import CustomText from '../../../components/CustomText';
import { Colors, Fonts, Headings } from '../../../variables/variables';

type ToggleListTabsProps = {
  allUsersCount: number;
  activeUsersCount: number;
  showActiveUsers: boolean;
  toggleList: (value: boolean) => void;
};

const ToggleListTabs = ({ 
  allUsersCount, 
  activeUsersCount, 
  showActiveUsers, 
  toggleList 
}: ToggleListTabsProps) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableWithoutFeedback onPress={() => toggleList(false)}>
        <View style={[
          styles.tab, 
          { backgroundColor: showActiveUsers ? Colors.purpleLight : Colors.purpleDark }
        ]}>
          <CustomText 
            style={styles.tabText}
            color={showActiveUsers ? Colors.purpleDark : Colors.white}
            fontSize={Headings.headingSmall}
            fontWeight={Fonts.semiBold}
          >
            All ({allUsersCount})
          </CustomText>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => toggleList(true)}>
      <View style={[
          styles.tab,
          { backgroundColor: showActiveUsers ? Colors.purpleDark : Colors.purpleLight }
      ]}>
        <CustomText 
          style={styles.tabText}
          color={showActiveUsers ? Colors.white : Colors.purpleDark}
          fontSize={Headings.headingSmall}
          fontWeight={Fonts.semiBold} 
        >
          Active ({activeUsersCount})
        </CustomText>
      </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 6,
    backgroundColor: Colors.purpleLight,
    width: 300,
    borderRadius: 35,
    marginTop: 15
  },
  tab: {
    paddingVertical: 6, 
    width: '50%', 
    borderRadius: 35
  },
  tabText: {
    textAlign: 'center'
  }
});

export default ToggleListTabs;

