import { Socket } from 'socket.io';
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Chat = mongoose.model('Chat');
const Message = mongoose.model('Message');
import { TChat } from '../types/index';

// User sends new message
export const onMessage = async (
  io: Socket,
  socket: Socket, 
  users: { [key: string]: Socket },
  data: string
): Promise<void> => {
  const {
    chatType,
    chatId,
    senderId,
    recipientId,
    message,
    isFirstMessage
  } = JSON.parse(data);

  let chat: TChat,
      newChat,
      recipientSocketId: string;

  // Update database
  // Private chat
  if (chatType === 'private') {

    if (isFirstMessage) { 
      // Create chat if first message
      newChat = new Chat({
        chatId,
        type: chatType,
        participants: [senderId, recipientId],
        requester: senderId
      });
      await newChat.save();

      // Add chat to both users chat lists
      await User.updateOne(
        { _id: recipientId },
        { $addToSet: { chats: newChat._id } }
      );

      // Add contact to user's pending contacts
      const addContactToPending = await User.updateOne(
        { _id: senderId }, 
        { 
          $addToSet: {
            pendingContacts:  recipientId,
            chats: newChat._id
          }
        },
        { new: true }
      );
    } else {
      // Check if chat request accepted
      chat = await Chat.findOne({ chatId });

      if (!chat.requestAccepted) {
        // Accept chat request if message sender is recipient of request
        if (chat.requester == recipientId) {
          await Chat.updateOne(
            { chatId }, 
            { $set: { requestAccepted: true } }
          );

          // Add both users to each other's contact lists
          await User.updateOne(
            { _id: senderId },
            { $addToSet: { contacts:  recipientId }}
          );

          await User.updateOne(
            { _id: recipientId },
            { 
              $pull: { pendingContacts: senderId },
              $addToSet: { contacts:  senderId }
            }
          );
        }
      }
    }

  }

  // Create new message
  const newMessage = new Message({
    chatId,
    sender: message.sender.name,
    message: {
      id: message._id,
      text: message.text,
      createDate: message.createDate
    }
  });
  await newMessage.save();

  // If new message created successfully
  if (newMessage) {

    // Emit events
    if (chatType === 'private') {
      // Check if message recipient is online and get socket id
      if (users[recipientId]) {
        recipientSocketId = users[recipientId].id;
      }

      if (isFirstMessage) {
        const data = { newChat, lastMessage: newMessage };

        // Add new chat and send new message to recipient
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('first_message_received', {

          });
        }
        // Add new chat, register chat id and send confirmation of message delivered to sender
        socket.emit('first_message_sent', JSON.stringify(data));
      } else {
        // Send new message to recipient and update chat
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('message_received', {

          });
        }
        // Send confirmation of message delivered to sender and update chat list
        socket.emit('message_sent');
      }
    }

  }
};

// User likes message
export const onLikeMessage = async (
  io: Socket,
  socket: Socket, 
  users: { [key: string]: Socket },
  data: string
): Promise<void> => {
  const { chatId, messageId, recipientId } = JSON.parse(data);

  const message = await Message.findOne({ 'message.id': messageId });

  await Message.updateOne(
    { 'message.id': messageId },
    { liked: { 
        likedByUser: !message.liked.likedByUser,
        likesCount: message.liked.likedByUser ? message.liked.likesCount - 1 : message.liked.likesCount + 1
    }}
  );

  // Check if message recipient is online and get socket id
  if (users[recipientId]) {
    let recipientSocketId = users[recipientId].id;
    // Notify recipient of like
    const data = { chatId, messageId };
    io.to(recipientSocketId).emit('messaged_liked', JSON.stringify(data));
  }
};

// User deletes message
export const onDeleteMessage = async (
  io: Socket,
  socket: Socket, 
  users: { [key: string]: Socket },
  data: string
): Promise<void> => {
  const { chatId, messageId, recipientId } = JSON.parse(data);

  await Message.deleteOne({ 'message.id': messageId });

  // Check if message recipient is online and get socket id
  if (users[recipientId]) {
    let recipientSocketId = users[recipientId].id;
    // Notify recipient of delete
    const data = { chatId, messageId };
    io.to(recipientSocketId).emit('messaged_deleted', JSON.stringify(data));
  }
};