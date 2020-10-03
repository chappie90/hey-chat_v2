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
          { backgroundColor: showActiveUsers ? Colors.white : Colors.lightGrey }
        ]}>
          <CustomText 
            style={styles.tabText}
            color={showActiveUsers ? Colors.grey : Colors.darkGrey}
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
          { backgroundColor: showActiveUsers ? Colors.lightGrey : Colors.white }
      ]}>
        <CustomText 
          style={styles.tabText}
          color={showActiveUsers ? Colors.darkGrey : Colors.grey}
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
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingHorizontal: '15%', 
    paddingVertical: 10
  },
  tab: {
    paddingVertical: 4, 
    width: 96, 
    borderRadius: 20
  },
  tabText: {
    textAlign: 'center'
  }
});

export default ToggleListTabs;

