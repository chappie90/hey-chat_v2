import { Reducer } from 'redux';

type ContactsState = {
  contacts: TContact[] | [];
};

const INITIAL_STATE: ContactsState = {
  contacts: []
};

export const contactsReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'new_contact':
      return { ...state, contacts: [ ...state.contacts, action.payload ] };
    case 'get_contacts':
      return { ...state, contacts: action.payload };
    default:
      return state;  
  }
};