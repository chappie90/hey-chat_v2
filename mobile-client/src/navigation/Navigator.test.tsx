import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import renderer from 'react-test-renderer';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react-native';

import Navigator from './Navigator';

describe('Navigation', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(cleanup);

  it('renders Navigator correctly', async () => {
    const state = { token: 'Fake token' };
    const component = render(
        <Navigator />
    );
     
    expect(component).toBeTruthy();
  });
});