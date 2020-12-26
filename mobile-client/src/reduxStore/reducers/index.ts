import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { contactsReducer } from './contactsReducer';
import { chatsReducer } from './chatsReducer';
import { profileReducer } from './profileReducer';
import { videoCallReducer } from './videoCallReducer';

export default combineReducers({
    auth: authReducer,
    contacts: contactsReducer,
    chats: chatsReducer,
    profile: profileReducer,
    video: videoCallReducer
});