import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type ContactsState = {
  contacts: TContact[] | [];
};

type ContactsAction =
  | { type: 'new_contact'; payload: TContact }
  | { type: 'get_contacts'; payload: TContact[] };

const searchContacts = (username: string, search: string) => async (dispatch: ThunkDispatch<ContactsState, undefined, ContactsAction>): Promise<TContact[] | void> => {
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

const getContacts = (userId: number) => async (dispatch: ThunkDispatch<ContactsState, undefined, ContactsAction>): Promise<TContact[] | void> => {
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

export default {
  searchContacts,
  getContacts
};  