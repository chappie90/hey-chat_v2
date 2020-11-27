import React from 'react';
import renderer from 'react-test-renderer';
import { cleanup, render, fireEvent, RenderAPI } from '@testing-library/react-native';

import AuthForm from 'components/authentication/AuthForm';

describe('AuthForm', () => {
  let component: RenderAPI,
      onSubmitMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    onSubmitMock = jest.fn();
    
    const props = {
      heading: '',
      buttonText: 'submitButton',
      onSubmitCallback: onSubmitMock,
      toggleModals: jest.fn(),
      toggleModalPrompt: '',
      toggleModalLink: ''
    };

    component = render(<AuthForm { ...props} />);
  });

  it('should render AuthForm component  correctly', () => {
    expect(component).toBeTruthy();
  });

  it('should call submitCallback with username and password', () => {
    fireEvent(component.getByPlaceholderText('Username'), 'onChangeText', 'test username'); 
    fireEvent(component.getByPlaceholderText('Password'), 'onChangeText', 'test password');
    fireEvent.press(component.getByText('submitButton'));

    expect(onSubmitMock).toHaveBeenCalledWith('test username', 'test password');
  });
});

// describe('TextInputs', () => {
//   let component: RenderAPI;

//   beforeEach(() => {
//     jest.useFakeTimers();
//     component = render(<AuthForm  />);
//   });

//   it('should change username textinput value when typing', () => {
//     const onChangeTextMock = jest.fn();

//     const element = component.getByPlaceholderText('Username');
//     fireEvent(element, 'onChangeText', 'test');

//     expect(element.value).toContain('test');
//   });
// });
