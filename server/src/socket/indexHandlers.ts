import { Socket } from "socket.io";
const mongoose = require('mongoose');

const User = mongoose.model('User');

export const onConnect = async (
  io: Socket,
  socket: Socket, 
  users: { [key: string]: Socket }, 
  onlineContacts: string[]
): Promise<{ userId: string, socketId: string }> => {
  console.log('Socket connected');

  const userId: string = socket.handshake.query.userId;
  const socketId: string = socket.id;

  // Add user to list of users on connect
  users[userId] = socket;

  // Create channel for user
  socket.join(userId);

  try {
    const user = await User.findOne({ _id: userId })
                           .populate('pendingContacts', '_id')
                           .populate('contacts', '_id');

    const contacts = [ ...user.pendingContacts, ...user.contacts ];

    // Get a list of user contacts who are online
    for (const contact of contacts) {
      for (const [key, value] of Object.entries(users)) {
        if (contact._id === key) {
          if (!onlineContacts.includes(key)) {
            onlineContacts.push(key);
          }
          // Add online contact to user channel
          users[key].join(userId);
        }
      }
    }

    // Notify all online contacts in your channel you are now online
    socket.broadcast.to(userId).emit('new_online_user', userId);

    // Send yourself a list of your online contacts
    io.to(socketId).emit('my_online_contacts', onlineContacts);
  } catch (err) {
    console.log(err);
  }

  return { userId, socketId };
};