import createDataContext from './createDataContext';
import api from '../api/api';

const contactsReducer = (state, action) => {
  switch (action.type) {
    // case 'clear_search_results':
    //   return { ...state, searchResults: [] };
    // case 'new_contact':
    //   return { ...state, contacts: [ ...state.contacts, action.payload ] };
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

const searchContacts = dispatch => async (username: string, search: string): Promise<string[] | undefined> => {
  console.log(username)
  console.log(search)
  try {
    const response = await api.post('/contacts/search', { username, search });
    if (response.data.contacts !== undefined || response.data.contacts.length != 0) {
      const contacts = response.data.contacts.sort((a, b) => a.username.localeCompare(b.username));
      console.log(contacts)
      return contacts;
    }
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

// const addContact = dispatch => async ({ username, contact }) => {
//   try {
//     const response = await chatApi.post('/contacts/add', { username, contact });
    
//     dispatch({ type: 'new_contact', payload: response.data.contact });

//     navigate('ContactsList');
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

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
    // clearSearchResults, 
    // addContact, 
    // getContacts,
    // getActiveStatus,
    // userIsOffline,
    // resetContactsState
  },
  { 
    // searchResults: [], 
    contacts: [],
    onlineContacts: []
  }
);