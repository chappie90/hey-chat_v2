import React, { useEffect, useRef, useContext } from 'react';

import { Context as AuthContext } from '../context/AuthContext';
import { Context as ChatsContext } from '../context/ChatsContext';

const SocketEventListeners = () => {
  const { state: { userId, token, socketState } } = useContext(AuthContext);
  const { 
    state: { chatHistory }, 
    addChat,
    getMessages, 
    getMoreMessages,
    addMessage
  } = useContext(ChatsContext);

  useEffect(() => {
    // Add event listeners
    if (socketState) {
      // Add new chat, replace temporary contact id with new chat id in chatHistory global state
      // and send confirmation of message delivered to sender
      socketState.on('first_message_sent', (data: string) => {
        const { newChat, lastMessage } = JSON.parse(data);

        const chat = { ...newChat, lastMessage };
        addChat(chat);
      });
    }
  }, [socketState]);

  return <></>;
};

export default SocketEventListeners;
