import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import eventHandlers from './eventHandlers';

const SocketEventListeners = () => {
  const { userId, username, socketState, currentScreen } = useSelector(state => state.auth);
  const { chatHistory } = useSelector(state => state.chats);
  const currentScreenRef = useRef('');
  const dispatch = useDispatch();

  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    // Add event listeners
    if (socketState) {
      // User has successfully connected
      socketState.on('get_contacts', (data: string) => {
        eventHandlers.onGetContacts(data, dispatch);
      });

      // User has successfully connected
      socketState.on('get_online_contacts', (data: string) => {
        eventHandlers.onGetOnlineContacts(data, dispatch);
      });

      // Add new chat, replace temporary contact id with new chat id in chatHistory global state
      // and send confirmation of message delivered to sender
      socketState.on('first_message_sent', (data: string) => {
        eventHandlers.onFirstMessageSent(data, dispatch);
      });

      // Update sender chat and send confirmation of message delivered to sender
      socketState.on('message_sent', (data: string) => {
        eventHandlers.onMessageSent(data, dispatch);
      });

      // Update recipient's chats list and add new message to chat history
      socketState.on('message_received', (data: string) => {
        eventHandlers.onMessageReceived(data, username, chatHistory, dispatch, socketState, currentScreenRef.current);
      });

      // Mark all sender's chat history messages as read
      socketState.on('messages_marked_as_read_sender', (data: string) => {
        eventHandlers.onMessagesMarkedAsReadSender(data, dispatch);
      });

      // Update recipient's chat messages with liked message
      socketState.on('message_liked', (data: string) => {
        eventHandlers.onMessageLiked(data, dispatch);
      }); 

      // Delete message for recipient
      socketState.on('message_deleted', (data: string) => {
        eventHandlers.onMessageDeleted(data, dispatch);
      }); 

      // Update recipient's chat with new contact profile image
      socketState.on('profile_image_updated', (data: string) => {
        eventHandlers.onProfileImageUpdated(data, dispatch);
      });

      // Notify user when contact goes online
      socketState.on('user_online', (data: string) => {
        eventHandlers.onContactIsOnline(data, userId, dispatch);
      }); 

      // Notify user when contact goes offline
      socketState.on('user_offline', (userId: string) => {
        eventHandlers.onContactIsOffline(userId, dispatch);
      }); 

      // Contact has started typing
      socketState.on('contact_is_typing', (contactId: string) => {
        eventHandlers.onContactIsTyping(contactId, dispatch);
      }); 

      // Contact has stopped typing
      socketState.on('contact_stopped_typing', (contactId: string) => {
        eventHandlers.onContactStoppedTyping(contactId, dispatch);
      }); 

      // User has successfully established socket connection
      socketState.on('user_connected', () => {
        eventHandlers.onUserConnected(dispatch);
      });
    }
  }, [socketState]);

  return <></>;
};

export default SocketEventListeners;
