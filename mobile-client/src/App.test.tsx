import 'react-native';
import React from 'react';
import App from './App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { cleanup, render, fireEvent } from '@testing-library/react-native';

// describe('App', () => {
//   beforeEach(() => jest.useFakeTimers());
//   afterEach(cleanup);
  
//   it('should render App component  correctly', () => {
//     const rendered = render(<App />);
//     expect(rendered).toBeTruthy();
//   });
// });


// // Snapshot test
// describe('App', () => {
//   afterEach(cleanup); //Unmounts React trees that were mounted with render to prevent memory leak.
//   it('should render correctly', () => {
//     const {toJSON} = render(<App />);
//     expect(toJSON()).toMatchSnapshot();
//   });
// });
