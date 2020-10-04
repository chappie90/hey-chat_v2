import io from 'socket.io-client';

export const socket = io('http://localhost:3006');

export const emitMessage = (data: string) => {
  console.log(data)
  socket.emit('message', data);
};

// socket.on('message', (message: string) => {
//   console.log(message);
// });