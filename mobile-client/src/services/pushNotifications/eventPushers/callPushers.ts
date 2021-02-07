import api from 'api';

// Push start call signal to contact
const pushStartCall = async (
  callId: string,
  chatId: string, 
  caller: TContact,
  callee: TContact,
  callType: string
): Promise<void> => {
  try {
    const data = { callId, chatId, caller, callee, callType };

    await api.post('/call/start', data); 
  } catch (err) {
    console.log('Push start call notification error')
    console.error(err);
  }
};

// Push end call signal to callee and notify them they have a missed call
const pushMissedCall = async (chatId: string, calleeId: string, message: TMessage): Promise<void> => {
  try {
    const data = { chatId, calleeId, message };

    await api.post('/call/missed', data); 
  } catch (err) {
    console.log('Push missed call notification error')
    console.error(err);
  }
};

// Push end call signal to contact
const pushEndCall = async (chatId: string, contactId: string): Promise<void> => {
  try {
    const data = { chatId, contactId };

    await api.post('/call/end', data); 
  } catch (err) {
    console.log('Push end call notification error')
    console.error(err);
  }
};

// Notify contact of change to remote stream
const pushToggleVideo = async (chatId: string, contactId: string): Promise<void> => {
  try {
    const data = { chatId, contactId };

    await api.post('/call/video/camera', data); 
  } catch (err) {
    console.log('Push toggle video camera notification error')
    console.error(err);
  }
};

// Notify contact of change to remote stream
const pushRequestVideo = async (chatId: string, contactId: string): Promise<void> => {
  try {
    const data = { chatId, contactId };
    
    await api.post('/call/audio/request-video', data); 
  } catch (err) {
    console.log('Push request video call notification error')
    console.error(err);
  }
};

export default {
  pushStartCall,
  pushMissedCall,
  pushEndCall,
  pushToggleVideo,
  pushRequestVideo
};