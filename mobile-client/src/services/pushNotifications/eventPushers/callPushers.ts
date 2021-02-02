import api from 'api';

// Push end call signal to callee and notify them they have a missed call
const pushMissedCall = async (chatId: string, calleeId: string, message: TMessage): Promise<void> => {
  try {
    const data = { chatId, calleeId, message };

    await api.post('/call/missed', data); 
  } catch (err) {
    console.log('Push missed call push notification error')
    console.error(err);
  }
};

// Push end call signal to contact
const pushEndCall = async (chatId: string, contactId: string): Promise<void> => {
  try {
    const data = { chatId, contactId };

    await api.post('/call/end', data); 
  } catch (err) {
    console.log('Push end call push notification error')
    console.error(err);
  }
};

export default {
  pushMissedCall,
  pushEndCall
};