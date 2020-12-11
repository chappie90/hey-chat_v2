import { Reducer } from 'redux';

type ContactsState = {
  contacts: TContact[] | [];
  onlineContacts: TContact[] | [];
  contactsFetched: boolean;
};

const INITIAL_STATE: ContactsState = {
  contacts: [],
  onlineContacts: [],
  contactsFetched: false
};

export const contactsReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'new_contact':
      return { ...state, contacts: [ ...state.contacts, action.payload ] };
    case 'get_contacts':
      return { ...state, contacts: action.payload };
    case 'get_online_contacts':
      return { ...state, onlineContacts: action.payload };
    case 'mark_contacts_as_fetched':
      return { ...state, contactsFetched: true };
    default:
      return state;  
  }
};