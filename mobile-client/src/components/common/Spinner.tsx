import React from 'react';
import { View } from 'react-native';
import { BallIndicator } from 'react-native-indicators';

import { Colors } from 'variables';

type SpinnerProps = {
  layout: any;
};

const Spinner = ({ layout }: SpinnerProps) => (
  <View style={{ ...layout }}>
    <BallIndicator size={32} color={Colors.purpleDark} />
  </View>
);

export default Spinner;