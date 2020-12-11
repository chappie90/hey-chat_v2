import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type ContactsState = {
  contacts: TContact[] | [];
  onlineContacts: TContact[] | [];
  contactsFetched: boolean;
};

type ContactsAction =
  | { type: 'new_contact'; payload: TContact }
  | { type: 'get_contacts'; payload: TContact[] }
  | { type: 'get_online_contacts'; payload: TContact[] }
  | { type: 'mark_contacts_as_fetched' };

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

const getContacts = (contacts: TContact[]) => ({ type: 'get_contacts', payload: contacts });

const getOnlineContacts = (onlineContacts: TContact[]) => ({ type: 'get_online_contacts', payload: onlineContacts });

const markContactsAsFetched = () => ({ type: 'mark_contacts_as_fetched' });

export default {
  searchContacts,
  getContacts,
  getOnlineContacts,
  markContactsAsFetched
};  