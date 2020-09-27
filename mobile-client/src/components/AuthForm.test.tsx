import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';

import AuthForm from './AuthForm';

jest.useFakeTimers();

it('should render AuthForm component  correctly', () => {
  const rendered = renderer.create(<AuthForm />).toJSON();
  expect(rendered).toBeTruthy();
});