import React, { useRef, useState, useEffect } from 'react';
import { 
  View,
  TouchableWithoutFeedback, 
  StyleSheet,
  Animated,
  LayoutChangeEvent
} from 'react-native';

import { Colors } from '../variables/variables';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const translateAnim = useRef(new Animated.Value(7)).current;
  const tabsXPos = useRef<{ [key: string]: number }>({});
  const [tabWidth, setTabWidth] = useState(0);
  const activeRouteIndex = useRef(0);

  const getTabDimensions = (event: LayoutChangeEvent) => {
    const { target, layout: { x, width } } = event.nativeEvent;

    tabsXPos.current[target] = x;
    if (tabWidth === 0) setTabWidth(width);
  };

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  useEffect(() => {
    if (activeRouteIndex.current) {
      Animated.timing(
        translateAnim,
        {
          toValue: tabsXPos.current[Object.keys(tabsXPos.current)[activeRouteIndex.current]],
          duration: 200,
          useNativeDriver: true
        }
      ).start();
    }
  }, [state.routes]);

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[ 
          styles.animatedTab, 
          { 
            width: tabWidth,
            transform: [{ translateX: translateAnim }] 
          }
        ]} 
      />
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

          activeRouteIndex.current = index;

          Animated.timing(
            translateAnim,
            {
              toValue: tabsXPos.current[Object.keys(tabsXPos.current)[activeRouteIndex.current]],
              duration: 200,
              useNativeDriver: true
            }
          ).start();
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
              onLayout={event => getTabDimensions(event)}
              style={styles.tab} 
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
  },
  animatedTab: {
    height: 40,
    backgroundColor: Colors.darkGrey,
    borderRadius: 26,
    position: 'absolute',
    top: 6
  }
});

export default CustomTabBar;