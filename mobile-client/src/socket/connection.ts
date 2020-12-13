import io from 'socket.io-client';
import Config from 'react-native-config';

export const connectToSocket = (userId: number) => {
  return io(Config.RN_API_BASE_URL, { query: `userId=${userId}` });
};