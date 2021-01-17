import React, { useEffect } from 'react';
import {
  StyleSheet, 
  View, 
  Image, 
  useWindowDimensions,
  Platform
} from 'react-native';

type AudioCallActionsProps = {
  
};

const AudioCallActions = ({  }: AudioCallActionsProps) => {

  return (
    <View style={styles.container}>
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.yellowLight,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginBottom: -35
  },
 
});

export default AudioCallActions;

