import io from 'socket.io-client';

export const connectToSocket = (userId: number) => {
  return io('http://localhost:3006', { query: `userId=${userId}` });
};