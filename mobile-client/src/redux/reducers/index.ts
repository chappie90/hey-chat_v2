import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { contactsReducer } from './contactsReducer';
import { chatsReducer } from './chatsReducer';
import { profileReducer } from './profileReducer';

export default combineReducers({
    auth: authReducer,
    contacts: contactsReducer,
    chats: chatsReducer,
    profile: profileReducer
});