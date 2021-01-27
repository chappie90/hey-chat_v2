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
    case 'add_pending_contact':
      return  {
        ...state, 
        contacts: [ ...state.contacts, action.payload ]
      };
    case 'update_pending_contact':
      updatedContacts = (state.contacts as TContact[]).map((contact: TContact) => {
        return contact._id === action.payload ?
          { 
            ...contact, 
            pending: false,
            online: true 
          } :
          contact
      });


      updatedOnlineContacts = [ 
        ...state.onlineContacts, 
        updatedContacts.filter((contact: TContact) => contact._id === action.payload)[0]
      ];

      return  {
        ...state, 
        contacts: updatedContacts,
        onlineContacts: updatedOnlineContacts
      };
    case 'add_contact':
      updatedOnlineContacts = action.payload.online ?
        [ ...state.onlineContacts, action.payload ] :
        state.onlineContacts;

      return  {
        ...state, 
        contacts: [ ...state.contacts, action.payload ],
        onlineContacts: updatedOnlineContacts
      };
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
    case 'update_contact_avatar':
      updatedContacts = (state.contacts as TContact[]).map((contact: TContact) => {
        return contact._id === action.payload.contactId ?
          { 
            ...contact, 
            avatar: {
              ...state.avatar,
              small: action.payload.avatar
            }
          } :
          contact
      });

      updatedOnlineContacts = (state.onlineContacts as TContact[]).map((contact: TContact) => {
        return contact._id === action.payload.contactId ?
          { 
            ...contact, 
            avatar: {
              ...state.avatar,
              small: action.payload.avatar
            }
          } :
          contact
      });

      return  {
        ...state, 
        contacts: updatedContacts,
        onlineContacts: updatedOnlineContacts
      };
    default:
      return state;  
  }
};