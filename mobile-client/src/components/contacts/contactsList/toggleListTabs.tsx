import React, { useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';

import CustomText from 'components/CustomText';
import { Colors, Fonts, Headings } from 'variables';

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
  const translateAnim = useRef(new Animated.Value(0)).current;

  const onToggleTabs = (toggleState: boolean): void => {
    Animated.timing(
      translateAnim,
      {
        toValue: toggleState ? 130 : 0,
        duration: 200,
        useNativeDriver: true
      }
    ).start();

    toggleList(toggleState);
  };

  return (
    <View style={styles.tabsContainer}>
      <Animated.View style={[styles.animatedTab, { transform: [{ translateX: translateAnim }] }]} />
      <TouchableWithoutFeedback onPress={() => onToggleTabs(false)}>
        <View style={[ styles.tab, styles.allUsersTab ]}>
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
      <TouchableWithoutFeedback onPress={() => onToggleTabs(true)}>
      <View style={[ styles.tab, styles.activeUsersTab ]}>
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
    backgroundColor: Colors.purpleLight,
    width: 260,
    borderRadius: 35,
    marginTop: 20,
    marginBottom: 10
  },
  animatedTab: {
    width: 130,
    height: 35,
    backgroundColor: Colors.purpleDark,
    borderRadius: 35
  },
  tab: {
    top: 0,
    bottom: 0,
    borderRadius: 35,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  allUsersTab: {
    left: 0,
    right: 130,
  },
  activeUsersTab: {
    left: 130,
    right: 0
  },
  tabText: {
    textAlign: 'center'
  }
});

export default ToggleListTabs;

