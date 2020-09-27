import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';

import Navigator from './Navigator';
import { Provider as AuthProvider } from '../context/AuthContext';

describe('React navigation', () => {
  test('page contains the header', async () => {
    const state = { token: 'Fake token' };
    const component = renderer.create(
      <AuthProvider state={state}>
        <Navigator />
      </AuthProvider>
    );
  });


});