import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { Colors, Fonts } from 'variables';
import CustomText from 'components/CustomText';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { chats } = useSelector(state => state.chats);

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

        let unreadMessagesCount = 0;
        if (route.name === 'Chats') {
          unreadMessagesCount = chats?.filter((chat: TChat) => chat.unreadMessagesCount > 0).length;
        }

        return (
          <TouchableWithoutFeedback
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
          >
            <View style={[
              styles.tab,
              { backgroundColor: isFocused ? Colors.greyDark : Colors.greyLight }
            ]}>
              {options.tabBarIcon({ size: 30, focused: isFocused })}
              {route.name === 'Chats' && unreadMessagesCount > 0 &&
                <View style={[ 
                  styles.unreadBadge,
                  unreadMessagesCount > 9 ? styles.bigBadge : styles.smallBadge
                ]}>
                  <CustomText 
                    color={Colors.white}
                    fontWeight={Fonts.semiBold} 
                    fontSize={12}
                  >
                    {unreadMessagesCount > 9 ? '10+' : unreadMessagesCount}
                  </CustomText>
                </View>
              }
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
    backgroundColor: Colors.greyLight,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 26,
    marginHorizontal: 15,
    marginVertical: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 26
  },
  unreadBadge: {
    backgroundColor: Colors.yellowDark,
    borderRadius: 10,
    paddingHorizontal: 5.5,
    position: 'absolute',
    top: 2
  },
  bigBadge: {
    right: 26
  },
  smallBadge: {
    right: 32
  }
});

export default CustomTabBar;