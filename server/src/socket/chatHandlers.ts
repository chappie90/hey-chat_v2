import { Mongoose } from "mongoose";

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Chat = mongoose.model('Chat');
const Message = mongoose.model('Message');

export const onMessage = async (data: string): Promise<void> => {
  const {
    chatType,
    chatId,
    senderId,
    recipientId,
    message
  } = JSON.parse(data);

  let chat,
      newChatId: number;

  // Private chat
  if (chatType === 'private') {

    if (chatId) {
      // Check if chat request accepted
      chat = await Chat.findOne({ _id: chatId });
      if (!chat.requestAccepted) {
        // Accept chat request if message sender is recipient of request
        if (chat.requester === recipientId) {
          await Chat.updateOne(
            { _id: chatId }, 
            { requestAccepted: true }
          );

          // Add both users to each other's contact lists
          await User.updateOne(
            { _id: senderId },
            { $addToSet: { contacts:  recipientId }}
          );

          await User.updateOne(
            { _id: recipientId },
            { 
              $pull: { 'pendingContacts': { _id: senderId } },
              $addToSet: { contacts:  senderId }
            }
          );
        }
      }
    } else {
      // Create chat if first message
      const newChat = new Chat({
        type: chatType,
        participants: [senderId, recipientId],
        requester: senderId
      });
      await newChat.save();

      newChatId = newChat._id;

      // Add chat to both users chat lists
      await User.updateOne(
        { _id: recipientId },
        { $addToSet: { chats: newChatId } }
      );

      // Add contact to user's pending contacts
      const addContactToPending = await User.updateOne(
        { _id: senderId }, 
        { 
          $addToSet: {
            pendingContacts:  recipientId,
            chats: newChatId
          }
        },
        { new: true }
      );
    }

  }

  // Create new message
  const newMessage = new Message({
    chat: chatId ? chatId : newChatId,
    sender: message.sender.name,
    message: {
      id: message._id,
      text: message.text,
      createDate: message.createDate
    }
  });
  await newMessage.save();

};