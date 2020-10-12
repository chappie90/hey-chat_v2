import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import { Colors } from '../variables/variables';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {

        const { options } = descriptors[route.key];
 
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableWithoutFeedback
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <View 
              style={[ 
                styles.tab, 
                { backgroundColor: isFocused ? Colors.darkGrey : Colors.lightGrey }
              ]} 
            >
              {options.tabBarIcon({ size: 30, focused: isFocused })}
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 52,
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 26,
    marginHorizontal: 15,
    marginVertical: 12
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 26
  }
});

export default CustomTabBar;