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
  let updatedContacts: TContact[];
  let updatedOnlineContacts: TContact[];

  switch (action.type) {
    case 'new_contact':
      return { ...state, contacts: [ ...state.contacts, action.payload ] };
    case 'get_contacts':
      return { ...state, contacts: action.payload };
    case 'get_online_contacts':
      return { ...state, onlineContacts: action.payload };
    case 'mark_contacts_as_fetched':
      return { ...state, contactsFetched: true };
    case 'contact_goes_online':
      updatedContacts = (state.contacts as TContact[]).map((contact: TContact) => {
        return contact._id === action.payload._id ?
          { ...contact, online: true } :
          contact
      });

      return { 
        ...state, 
        contacts: updatedContacts,
        onlineContacts: [ ...state.onlineContacts, action.payload ]
    };
    case 'contact_goes_offline':
      updatedContacts = (state.contacts as TContact[]).map((contact: TContact) => {
        return contact._id === action.payload ?
          { ...contact, online: false } :
          contact
      });

      updatedOnlineContacts = state.onlineContacts.filter((contact: TContact) => contact._id !== action.payload);

      return { 
        ...state, 
        contacts: updatedContacts,
        onlineContacts: updatedOnlineContacts
      };
    default:
      return state;  
  }
};