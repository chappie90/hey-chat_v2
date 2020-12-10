import React, { useEffect, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Context as ChatsContext } from 'context/ChatsContext';
import { emitMarkAllMessagesAsRead } from './eventEmitters';

const SocketEventListeners = () => {
  const { userId, token, socketState, currentScreen } = useSelector(state => state.auth);
  const { 
    state: { chatHistory }, 
    addChat,
    updateChat,
    getMessages, 
    getMoreMessages,
    addMessage,
    likeMessage,
    deleteMessage,
    markMessageAsDelivered,
    markMessagesAsReadSender
  } = useContext(ChatsContext);
  const currentScreenRef = useRef('');

  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    // Add event listeners
    if (socketState) {
      // Add new chat, replace temporary contact id with new chat id in chatHistory global state
      // and send confirmation of message delivered to sender
      socketState.on('first_message_sent', (data: string) => {
        const { newChat, newMessage } = JSON.parse(data);
        markMessageAsDelivered(newChat.chatId, newMessage.message.id);
        const chat = { ...newChat, lastMessage: newMessage };
        addChat(chat);
      });

      // Update sender chat and send confirmation of message delivered to sender
      socketState.on('message_sent', (data: string) => {
        const { chat, newMessage } = JSON.parse(data);
        markMessageAsDelivered(chat.chatId, newMessage.message.id);
        const updatedChat = { ...chat, lastMessage: newMessage };
        updateChat(updatedChat);
      });

      // Update recipient's chats list and add new message to chat history
      socketState.on('message_received', (data: string) => {
        const { chat, newMessage, newTMessage, senderId } = JSON.parse(data);
        const updatedChat = { ...chat, lastMessage: newMessage };
        updateChat(updatedChat);
        addMessage(
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
        );

        // If recipient is active on current chat screen, send signal to sender message has been read
        // and mark recipient's chat as read
        if (currentScreenRef.current === 'CurrentChat') {
          const eventData = { chatId: newMessage.chatId, senderId };
          emitMarkAllMessagesAsRead(JSON.stringify(eventData), socketState);
        }
      });

      // Mark all sender's chat history messages as read
      socketState.on('messages_marked_as_read_sender', (data: string) => {
        const { chatId } = JSON.parse(data);
        markMessagesAsReadSender(chatId);
      });

      // Update recipient's chat messages with liked message
      socketState.on('message_liked', (data: string) => {
        const { chatId, messageId } = JSON.parse(data);
        likeMessage(chatId, messageId);
      }); 

      // Delete message for recipient
      socketState.on('message_deleted', (data: string) => {
        const { chatId, messageId } = JSON.parse(data);
        deleteMessage(chatId, messageId);
      }); 

      // Update recipient's chat with new contact profile image
      socketState.on('profile_image_updated', (data: string) => {
        const { userId, profileImage } = JSON.parse(data);
        console.log('inside profile event listener')
        console.log(userId)
        console.log(profileImage)
      });

      // Notify contact when user goes online
      socketState.on('user_online', (userId: string) => {
        console.log(userId)
        console.log('user online')
      }); 

      // Notify contact when user goes offline
      socketState.on('user_offline', (userId: string) => {
        console.log(userId)
        console.log('user offline')
      }); 
    }
  }, [socketState]);

  return <></>;
};

export default SocketEventListeners;
