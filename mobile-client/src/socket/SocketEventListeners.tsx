import React, { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import { Context as ChatsContext } from 'context/ChatsContext';

const SocketEventListeners = () => {
  const { userId, token, socketState } = useSelector(state => state.auth);
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
        const { newChat, lastMessage } = JSON.parse(data);
        markMessageAsDelivered(newChat.chatId, lastMessage.message.id);
        const chat = { ...newChat, lastMessage };
        addChat(chat);
      });

      // Update sender chat and send confirmation of message delivered to sender
      socketState.on('message_sent', (data: string) => {
        const { chat, lastMessage } = JSON.parse(data);
        markMessageAsDelivered(chat.chatId, lastMessage.message.id);
        const updatedChat = { ...chat, lastMessage };
        updateChat(updatedChat);
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
