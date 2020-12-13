import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { emitMarkAllMessagesAsRead } from './eventEmitters';
import actions from 'reduxStore/actions';

const SocketEventListeners = () => {
  const { userId, token, socketState, currentScreen } = useSelector(state => state.auth);
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
        const { contacts } = JSON.parse(data);
        dispatch(actions.contactsActions.getContacts(contacts));
        dispatch(actions.contactsActions.markContactsAsFetched());
      });

      // User has successfully connected
      socketState.on('get_online_contacts', (data: string) => {
        const { onlineContacts } = JSON.parse(data);
        dispatch(actions.contactsActions.getOnlineContacts(onlineContacts));
      });

      // Add new chat, replace temporary contact id with new chat id in chatHistory global state
      // and send confirmation of message delivered to sender
      socketState.on('first_message_sent', (data: string) => {
        const { newChat, newMessage } = JSON.parse(data);
        dispatch(actions.chatsActions.markMessageAsDelivered(newChat.chatId, newMessage.message.id));
        const chat = { ...newChat, lastMessage: newMessage };
        dispatch(actions.chatsActions.addChat(chat));
      });

      // Update sender chat and send confirmation of message delivered to sender
      socketState.on('message_sent', (data: string) => {
        const { chat, newMessage } = JSON.parse(data);
        dispatch(actions.chatsActions.markMessageAsDelivered(chat.chatId, newMessage.message.id));
        const updatedChat = { ...chat, lastMessage: newMessage };
        dispatch(actions.chatsActions.updateChat(updatedChat));
      });

      // Update recipient's chats list and add new message to chat history
      socketState.on('message_received', (data: string) => {
        const { chat, newMessage, newTMessage, senderId, unreadMessagesCount } = JSON.parse(data);
        
        const updatedChat = { 
          ...chat, 
          lastMessage: newMessage,
          unreadMessagesCount: unreadMessagesCount
        };
        dispatch(actions.chatsActions.updateChat(updatedChat));
        
        dispatch(actions.chatsActions.addMessage(
          newMessage.chatId, 
          {
            ...newTMessage,
            sender: {
              ...newTMessage.sender,
              _id: 2
            },
            delivered: true,
            read: true
          }
        ));

        // If recipient is active on current chat screen, send signal to sender message has been read
        // and mark recipient's chat as read
        if (currentScreenRef.current === 'CurrentChat') {
          dispatch(actions.chatsActions.markMessagesAsReadRecipient(newMessage.chatId));
          const eventData = { chatId: newMessage.chatId, senderId };
          emitMarkAllMessagesAsRead(JSON.stringify(eventData), socketState);
        }
      });

      // Mark all sender's chat history messages as read
      socketState.on('messages_marked_as_read_sender', (data: string) => {
        const { chatId } = JSON.parse(data);
        dispatch(actions.chatsActions.markMessagesAsReadSender(chatId));
      });

      // Update recipient's chat messages with liked message
      socketState.on('message_liked', (data: string) => {
        const { chatId, messageId } = JSON.parse(data);
        dispatch(actions.chatsActions.likeMessage(chatId, messageId));
      }); 

      // Delete message for recipient
      socketState.on('message_deleted', (data: string) => {
        const { chatId, messageId } = JSON.parse(data);
        dispatch(actions.chatsActions.deleteMessage(chatId, messageId));
      }); 

      // Update recipient's chat with new contact profile image
      socketState.on('profile_image_updated', (data: string) => {
        const { userId, profileImage } = JSON.parse(data);
        console.log('inside profile event listener')
        console.log(userId)
        console.log(profileImage)
      });

      // Notify user when contact goes online
      socketState.on('user_online', (data: string) => {
        const { user } = JSON.parse(data);
        
        // If contact pending mark as such
        const isPending = user.pendingContacts.some((contact: TContact) => contact._id === userId);
        user.pending = isPending;

        // Get id of chat between user and contact
        const chats = [ ...user.chats, ...user.archivedChats ];
        const chatId: string = chats.filter(chat => chat.participants.filter((p: any) => p === userId))[0].chatId;
        user.chatId = chatId;

        user.online = true;

        dispatch(actions.contactsActions.contactGoesOnline(user));
      }); 

      // Notify user when contact goes offline
      socketState.on('user_offline', (userId: string) => {
        dispatch(actions.contactsActions.contactGoesOffline(userId));
      }); 

      // Contact has started typing
      socketState.on('contact_is_typing', (contactId: string) => {
        dispatch(actions.chatsActions.contactIsTyping(contactId));
      }); 

      // Contact has stopped typing
      socketState.on('contact_stopped_typing', (contactId: string) => {
        dispatch(actions.chatsActions.contactStoppedTyping(contactId));
      }); 
    }
  }, [socketState]);

  return <></>;
};

export default SocketEventListeners;
