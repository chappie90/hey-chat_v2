import { onMessage } from './chatHandlers';

module.exports = function(io) {
  // Connect to socket
  io.on('connection', (socket: any) => {
    console.log('Socket connected');

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

