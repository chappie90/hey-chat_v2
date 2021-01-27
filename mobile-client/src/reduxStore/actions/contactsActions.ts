import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type ContactsState = {
  contacts: TContact[] | [];
  onlineContacts: TContact[] | [];
  contactsFetched: boolean;
};

type ContactsAction =
  | { type: 'add_pending_contact'; payload: TContact }
  | { type: 'update_pending_contact'; payload: string }
  | { type: 'add_contact'; payload: TContact }
  | { type: 'get_contacts'; payload: TContact[] }
  | { type: 'get_online_contacts'; payload: TContact[] }
  | { type: 'mark_contacts_as_fetched' }
  | { type: 'contact_goes_online'; payload: TContact }
  | { type: 'contact_goes_offline'; payload: string }
  | { type: 'update_contact_avatar'; payload: { contactId: string, avatar: string } };

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

const addPendingContact = (contact: TContact) => ({ type: 'add_pending_contact', payload: contact });

const updatePendingContact = (contactId: string) => ({ type: 'update_pending_contact', payload: contactId });

const addContact = (contact: TContact) => ({ type: 'add_contact', payload: contact });

const getContacts = (contacts: TContact[]) => ({ type: 'get_contacts', payload: contacts });

const getOnlineContacts = (onlineContacts: TContact[]) => ({ type: 'get_online_contacts', payload: onlineContacts });

const markContactsAsFetched = () => ({ type: 'mark_contacts_as_fetched' });

const contactGoesOnline = (contact: TContact) => ({ type: 'contact_goes_online', payload: contact });

const contactGoesOffline = (contactId: string) => ({ type: 'contact_goes_offline', payload: contactId });

const updateContactAvatar = (contactId: string, avatar: string) => ({ type: 'update_contact_avatar', payload: { contactId, avatar } });

export default {
  searchContacts,
  addPendingContact,
  updatePendingContact,
  addContact,
  getContacts,
  getOnlineContacts,
  markContactsAsFetched,
  contactGoesOnline,
  contactGoesOffline,
  updateContactAvatar
};  