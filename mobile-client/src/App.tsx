import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
} from 'react-native';

import Navigator from './navigation/Navigator';
import { Provider as AuthProvider } from './context/AuthContext';

declare const global: {HermesInternal: null | {}};

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <Navigator />
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1
  },
  container: {
    flex: 1
  }
});

export default App;
