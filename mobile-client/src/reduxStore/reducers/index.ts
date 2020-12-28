import { combineReducers } from 'redux';
import { appReducer } from './appReducer';
import { authReducer } from './authReducer';
import { contactsReducer } from './contactsReducer';
import { chatsReducer } from './chatsReducer';
import { profileReducer } from './profileReducer';
import { videoCallReducer } from './videoCallReducer';

export default combineReducers({
    app: appReducer,
    auth: authReducer,
    contacts: contactsReducer,
    chats: chatsReducer,
    profile: profileReducer,
    video: videoCallReducer
});