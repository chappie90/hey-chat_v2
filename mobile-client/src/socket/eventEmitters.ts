import io from 'socket.io-client';

export const emitNewMessage = (data: string, socket: any) => {
  socket.emit('message', data);
};

export const emitLikeMessage = (data: string, socket: any) => {
  socket.emit('like_message', data);
};

// socket.on('message', (message: string) => {
//   console.log(message);
// });