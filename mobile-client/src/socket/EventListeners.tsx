import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from 'navigation/NavigationRef';

import { 
  appHandlers,
  contactsHandlers,
  chatsHandlers,
  profileHandlers,
  callHandlers
} from './eventHandlers';

const SocketEventListeners = () => {
  const { socketState, currentScreen } = useSelector(state => state.app);
  const { user: { _id: userId, username } } = useSelector(state => state.auth);
  const { chatHistory } = useSelector(state => state.chats);
  const { call } = useSelector(state => state.call);
  const currentScreenRef = useRef('');
  const callRef = useRef<TCall | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    currentScreenRef.current = currentScreen;
    callRef.current = call;
  }, [currentScreen, call]);

  useEffect(() => {
    // Add event listeners
    if (socketState) {
      // User has successfully connected
      socketState.on('get_contacts', (data: string) => {
        contactsHandlers.onGetContacts(data, dispatch);
      });

      // User has successfully connected
      socketState.on('get_online_contacts', (data: string) => {
        contactsHandlers.onGetOnlineContacts(data, dispatch);
      });

      // Add new chat to sender's chats list
      // replace temporary contact id with new chat id in chatHistory global state
      // send confirmation of message delivered to sender
      // and add new pending contact to sender's contacts list
      socketState.on('first_message_sent', (data: string) => {
        chatsHandlers.onFirstMessageSent(data, dispatch);
      });

      // Add new chat to recipient's chats list
      socketState.on('first_message_received', (data: string) => {
        chatsHandlers.onFirstMessageReceived(data, dispatch);
      });

      // Update sender chat and send confirmation of message delivered to sender
      socketState.on('message_sent', (data: string) => {
        chatsHandlers.onMessageSent(data, dispatch);
      });

      // Update recipient's chats list and add new message to chat history
      socketState.on('message_received', (data: string) => {
        chatsHandlers.onMessageReceived(data, username, chatHistory, dispatch, socketState, currentScreenRef.current);
      });

      // Mark all sender's chat history messages as read
      socketState.on('messages_marked_as_read_sender', (data: string) => {
        chatsHandlers.onMessagesMarkedAsReadSender(data, dispatch);
      });

      // Update recipient's chat messages with liked message
      socketState.on('message_liked', (data: string) => {
        chatsHandlers.onMessageLiked(data, dispatch);
      }); 

      // Delete message for recipient
      socketState.on('message_deleted', (data: string) => {
        chatsHandlers.onMessageDeleted(data, dispatch);
      }); 

      // Update recipient's chat with new contact profile image
      socketState.on('profile_image_updated', (data: string) => {
        profileHandlers.onProfileImageUpdated(data, dispatch);
      });

      // Notify user when contact goes online
      socketState.on('user_online', (data: string) => {
        contactsHandlers.onContactIsOnline(data, userId, dispatch);
      }); 

      // Notify user when contact goes offline
      socketState.on('user_offline', (userId: string) => {
        contactsHandlers.onContactIsOffline(userId, dispatch);
      }); 

      // Contact has started typing
      socketState.on('contact_is_typing', (contactId: string) => {
        contactsHandlers.onContactIsTyping(contactId, dispatch);
      }); 

      // Contact has stopped typing
      socketState.on('contact_stopped_typing', (contactId: string) => {
        contactsHandlers.onContactStoppedTyping(contactId, dispatch);
      }); 

      // User has successfully established socket connection
      socketState.on('user_connected', () => {
        appHandlers.onUserConnected(dispatch);
      });

      // User has sent message after deleting chat
      // Restore chat
      socketState.on('chat_restored', (data: string) => {
        chatsHandlers.onChatRestored(data, dispatch);
      });

      // Callee has confirmed receiving voip push 
      socketState.on('voip_push_received', (data: string) => {
        callHandlers.onConfirmVoipPushReceived(data, callRef.current?.RTCConnection, socketState, dispatch);
      });

      // Calee has received call offer
      socketState.on('call_offer_received', (data: string) => {
        if (callRef.current) callHandlers.onCallOfferReceived(data, callRef.current, dispatch);
      });

      // User has received contact's ice candidate
      socketState.on('ice_candidate_received', (data: string) => {
        callHandlers.onICECandidateReceived(data,  callRef.current?.RTCConnection, dispatch);
      });

      // Callee has accepted call
      socketState.on('call_accepted', (data: string) => {
        callHandlers.onCallAccepted(data, userId, socketState, callRef.current?.RTCConnection, dispatch);
      });

      // Recipient has rejected call
      socketState.on('call_rejected', () => {
        callHandlers.onCallRejected(navigate, dispatch);
      });

      // Caller has cancelled call
      socketState.on('call_cancelled', () => {
        callHandlers.onCallCancelled(dispatch);
      });

      // Either user ends call
      // Stop local stream
      socketState.on('call_ended', (data: string) => {
        callHandlers.onCallEnded(data, callRef.current?.localStream, callRef.current?.RTCConnection, navigate, dispatch);
      });

    }
  }, [socketState]);

  return <></>;
};

export default SocketEventListeners;
