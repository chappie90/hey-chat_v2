import { combineReducers } from 'redux';
import { appReducer } from './appReducer';
import { authReducer } from './authReducer';
import { contactsReducer } from './contactsReducer';
import { chatsReducer } from './chatsReducer';
import { callReducer } from './callReducer';

export default combineReducers({
    app: appReducer,
    auth: authReducer,
    contacts: contactsReducer,
    chats: chatsReducer,
    call: callReducer
});