import { onConnect } from './indexHandlers';
import { onMessage, onLikeMessage, onDeleteMessage } from './chatHandlers';
import { Socket } from 'socket.io';

const users: { [key: string]: Socket } = {};
const onlineContacts: string[] = [];

const initSocket = (io: Socket) => {
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
    socket.on('message', (data: string) => {
      onMessage(io, socket, users, data);
    });

    // User likes message
    socket.on('like_message', (data: string) => {
      onLikeMessage(io, socket, users, data);
    });

    // User deletes message
    socket.on('delete_message', (data: string) => {
      onDeleteMessage(io, socket, users, data);
    });

    // Disconnect from socket
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  });
};

module.exports = {
  initSocket
};
