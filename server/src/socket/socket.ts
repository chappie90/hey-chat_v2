import { onConnect } from './indexHandlers';
import { onUpdateProfileImage } from './profileHandlers';
import { 
  onMessage, 
  onLikeMessage, 
  onDeleteMessage,
  onMarkAllMessagesAsRead
} from './chatHandlers';
import { Socket } from 'socket.io';

const users: { [key: string]: Socket } = {};

const initSocket = (io: Socket) => {
  // Connect to socket
  io.on('connection', async (socket: Socket) => {
    const { userId, socketId } = await onConnect(io, socket, users);
    
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

    // User updated profile image
    socket.on('update_profile_image', (data: string) => {
      onUpdateProfileImage(socket, data);
    });

    // User reads messages
    socket.on('mark_messages_as_read', (data: string) => {
      onMarkAllMessagesAsRead(io, socket, users, data);
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
