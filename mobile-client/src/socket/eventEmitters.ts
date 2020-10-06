import io from 'socket.io-client';

export const emitMessage = (data: string, socket: any) => {
  socket.emit('message', data);
};

// socket.on('message', (message: string) => {
//   console.log(message);
// });