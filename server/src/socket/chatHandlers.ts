import { Socket } from 'socket.io';
const mongoose = require('mongoose');
import apn from 'apn';

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
      recipientSocketId: string,
      notification;

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
      newChat.populate('participants', '_id username profile').execPopulate();
      await newChat.save();

      // Add chat to both users chat lists
      await User.updateOne(
        { _id: recipientId },
        { $addToSet: { chats: newChat._id } }
      );

      // Add contact to user's pending contacts
      await User.updateOne(
        { _id: senderId }, 
        { 
          $addToSet: {
            pendingContacts:  recipientId,
            chats: newChat._id
          }
        }
      );
    } else {
      // Check if chat request accepted
      chat = await Chat.findOne({ chatId })
        .lean()
        .populate('participants', '_id username profile');

      if (!chat.requestAccepted) {
        // Accept chat request if message sender is recipient of request
        if (chat.requester == recipientId) {
          await Chat.updateOne(
            { chatId }, 
            { $set: { requestAccepted: true } }
          );
          chat.requestAccepted = true;

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

    // Emit events and send push notifications
    if (chatType === 'private') {
      // Check if message recipient is online and get socket id
      if (users[recipientId]) {
        recipientSocketId = users[recipientId].id;
      }

      // Check device OS to use approriate notification provider and get device token
      const recipient = await User.findOne({ _id: recipientId });
      const { deviceOS, deviceToken } = recipient;

      if (isFirstMessage) {
        const data = { newChat, newMessage };

        // Add new chat and send new message to recipient
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('first_message_received', JSON.stringify(data));
        }
        // Add new chat, register chat id and send confirmation of message delivered to sender
        socket.emit('first_message_sent', JSON.stringify(data));
      } else {
        const data = { chat, newMessage, newTMessage: message };

        // Send new message to recipient and update chat
        // If recipient is online, emit socket event with data
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('message_received', JSON.stringify(data));
        } else {
          // If recipient is offline, send silent push notification with data to update app state
          if (deviceOS === 'ios') {
            notification = new apn.Notification({
              "aps": {
                "content-available": "1",
                "alert": ""
              },
              "topic": process.env.APP_ID,
              "payload": {
                "key_1" : "Value_1",
                "key_2" : "Value_2",
                "key_3" : "Value_3"
              }
            });
          }
        }

        // Send confirmation of message delivered to sender and update chat list
        socket.emit('message_sent', JSON.stringify(data));
      }

      // Send push notification
      if (deviceOS === 'ios') {
        notification = new apn.Notification({
          "aps": {
            "alert": {
              "title": "New message received",
              "body": "Hi! How's it going?",
              "sound": "default"
            },
            "badge": 1
          },
          "topic": process.env.APP_ID
        });
        global.apnProvider.send(notification, deviceToken)
          .then( response => {
            // successful device tokens
            console.log(response.sent);
            // failed device tokens
            console.log(response.failed);
          });
      }
      if (deviceOS === 'android') {
        notification = {
          // "notification": {
          //   "title": 'Some title',
          //   "body": 'Test message body'
          // },
          "android":{
            "notification":{
               "body":"Very good news",
               "title":"Good news",
               "sound":"default"
            }
         },
          "data": {
            "key_1" : "Value_1",
            "key_2" : "Value_2",
            "key_3" : "Value_3"
          },
          token: deviceToken
          // topic: 'general'
        };

        global.firebaseAdmin.messaging().send(notification)
          .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
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