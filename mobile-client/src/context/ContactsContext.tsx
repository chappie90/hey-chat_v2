import createDataContext from './createDataContext';
import api from '../api/api';

type ContactsState = {
  contacts: TContact[] | [];
};

type ContactsAction =
  | { type: 'new_contact'; payload: TContact }
  | { type: 'get_contacts'; payload: TContact[] };

const contactsReducer = (state: ContactsState, action: ContactsAction) => {
  switch (action.type) {
    case 'new_contact':
      return { ...state, contacts: [ ...state.contacts, action.payload ] };
    case 'get_contacts':
      return { ...state, contacts: action.payload };
    // case 'get_active_status':
    //   let onlineUsers = [];
    //   for (let user of action.payload) {
    //     if (!state.onlineContacts.includes(user)) {
    //       onlineUsers.push(user);
    //     }
    //   }
    //   return { ...state, onlineContacts: [ ...state.onlineContacts, ...onlineUsers ] };
    // case 'user_is_offline':
    //   return { ...state, onlineContacts: state.onlineContacts.filter(item => item !== action.payload) };
    // case 'reset_state':
    //   return {
    //     searchResults: [], 
    //     contacts: [],
    //     onlineContacts: []
    //   };
    default:
      return state;  
  }
};

// const userIsOffline = dispatch => user => {
//   dispatch({ type: 'user_is_offline', payload: user });
// };

// const getActiveStatus = dispatch => (users) => {
//   dispatch({ type: 'get_active_status', payload: users });
// };

const searchContacts = dispatch => async (username: string, search: string): Promise<TContact[] | void> => {
  const params = { username, search };

  try {
    const response = await api.get('/contacts/search', { params });
    const contacts = response.data.contacts.sort((a, b) => a.username.localeCompare(b.username));

    return contacts;
  } catch (error) {
    console.log('Search contacts method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

const getContacts = dispatch => async (userId: number): Promise<TContact[] | void> => {
  const params = { userId };

  try {
    const response = await api.get('/contacts', { params });
    const contacts = response.data.contacts;

    dispatch({ type: 'get_contacts', payload: contacts });

    return contacts;
  } catch (error) {
    console.log('Get contacts method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

// const resetContactsState = dispatch => async () => {
//   dispatch({ type: 'reset_state' });
// };

export const { Context, Provider } = createDataContext(
  contactsReducer,
  { 
    searchContacts, 
    getContacts
    // getActiveStatus,
    // userIsOffline,
    // resetContactsState
  },
  { 
    contacts: [],
    onlineContacts: []
  }
);