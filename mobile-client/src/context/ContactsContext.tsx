import createDataContext from './createDataContext';
import api from '../api/api';

type Contact = {
  _id: number;
  username: string;
};

type ContactsState = {
  contacts: Contact[] | [];
};

type ContactsAction =
  | { type: 'new_contact'; payload: Contact };

const contactsReducer = (state: ContactsState, action: ContactsAction) => {
  switch (action.type) {
    case 'new_contact':
      return { ...state, contacts: [ ...state.contacts, action.payload ] };
    // case 'get_contacts':
    //   return { ...state, contacts: action.payload }; // change to contacts: action.payload
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

const searchContacts = dispatch => async (username: string, search: string): Promise<Contact[] | undefined> => {
  const params = { username, search };

  try {
    const response = await api.get('/contacts/search', { params });
    
    const contacts = response.data.contacts.sort((a, b) => a.username.localeCompare(b.username));

    return contacts;
  } catch (error) {
    console.log('Search contacts method error');
    if (error.response) {
      console.log(error.response.data.message);
      console.log(error.response.status);
    }
    if (error.message) console.log(error.message);
  }
};

// const clearSearchResults = dispatch => () => {
//   dispatch({ type: 'clear_search_results' });
// };

const addContact = dispatch => async (userId: number, contactId: number): Promise<void> => {
  try {
    const response = await api.post('/contacts/add', { userId, contactId });
    
    dispatch({ type: 'new_contact', payload: response.data.contact });
  } catch (error) {
    console.log('Add contact method error');
    if (error.response) {
      console.log(error.response.data.message);
      console.log(error.response.status);
    }
    if (error.message) console.log(error.message);
  }
};

// const getContacts = dispatch => async ({ username }) => {
//   try {
//     const response = await chatApi.post('/contacts', { username });

//     dispatch({ type: 'get_contacts', payload: response.data.contacts });

//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

// const resetContactsState = dispatch => async () => {
//   dispatch({ type: 'reset_state' });
// };

export const { Context, Provider } = createDataContext(
  contactsReducer,
  { 
    searchContacts, 
    addContact
    // getContacts,
    // getActiveStatus,
    // userIsOffline,
    // resetContactsState
  },
  { 
    contacts: [],
    onlineContacts: []
  }
);