import React, { useEffect, useContext } from 'react';

import { Context as AuthContext } from 'context/AuthContext';
import { Context as ChatsContext } from 'context/ChatsContext';

const SocketEventListeners = () => {
  const { state: { userId, token, socketState } } = useContext(AuthContext);
  const { 
    state: { chatHistory }, 
    addChat,
    updateChat,
    getMessages, 
    getMoreMessages,
    addMessage,
    likeMessage,
    deleteMessage,
    markMessageAsDelivered
  } = useContext(ChatsContext);

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
        const { chat, newMessage, newTMessage } = JSON.parse(data);
        const updatedChat = { ...chat, lastMessage: newMessage };
        updateChat(updatedChat);
        addMessage(newMessage.chatId, newTMessage);
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
    }
  }, [socketState]);

  return <></>;
};

export default SocketEventListeners;
