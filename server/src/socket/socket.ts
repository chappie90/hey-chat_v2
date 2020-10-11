import { onConnect } from './indexHandlers';
import { onMessage } from './chatHandlers';
import { Socket } from 'socket.io';

const users: { [key: string]: Socket } = {};
const onlineContacts: string[] = [];

module.exports = function(io) {
  // Connect to socket
  io.on('connection', async (socket: Socket) => {
    const { userId, socketId } = await onConnect(io, socket, users, onlineContacts);
    
    // To show a list of all room
    // console.log(io.sockets.adapter.rooms);

    // Get the clients in a room
    // io.in(userId).clients((err , clients) => {
    //   console.log(clients);
    // });
    
    // User connects
    socket.on('online', (userId: string) => {
      console.log(userId);
    });
  
    // User sends new message
    socket.on('message', onMessage);

    // Disconnect from socket
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  });
};

