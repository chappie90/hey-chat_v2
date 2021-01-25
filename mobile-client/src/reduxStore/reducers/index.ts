import { combineReducers } from 'redux';

import { appReducer } from 'reduxStore/reducers/appReducer';
import { authReducer } from 'reduxStore/reducers/authReducer';
import { contactsReducer } from 'reduxStore/reducers/contactsReducer';
import { chatsReducer } from 'reduxStore/reducers/chatsReducer';
import { callReducer } from 'reduxStore/reducers/callReducer';

export default combineReducers({
  app: appReducer,
  auth: authReducer,
  contacts: contactsReducer,
  chats: chatsReducer,
  call: callReducer
});