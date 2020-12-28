import React from 'react';
import renderer from 'react-test-renderer';
import { cleanup, render, fireEvent } from '@testing-library/react-native';

import StarterScreen from 'screens/StarterScreen';

describe('StarterScreen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(cleanup);

  it('should render StarterScreen component  correctly', () => {
    const rendered = render(<StarterScreen />);
    expect(rendered).toBeTruthy();
  });
});