import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { Colors } from 'variables';

type SpinnerProps = {
  layout: any;
  color?: string;
};

const Spinner = ({ layout, color }: SpinnerProps) => (
  <View style={{ ...layout }}>
    <ActivityIndicator size="large" color={color ? color : Colors.yellowDark} />
  </View>
);

export default Spinner;