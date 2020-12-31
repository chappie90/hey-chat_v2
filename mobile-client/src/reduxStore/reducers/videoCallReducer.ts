import { Reducer } from 'redux';

type VideoCallState = {
  localStream: any | null;
  RTCConnection: any | null;
  incomingCall: TIncomingCall;
  activeCall: TActiveCall
};

const INITIAL_STATE: VideoCallState = {
  localStream: null,
  RTCConnection: null,
  incomingCall: {
    status: false,
    chat: { chatType: 'private', chatId: '' },
    caller: {
      chatId: '',
      _id: 0,
      username: '',
      profile: {
        image: { small: { name: '' } }
      },
      online: true
    },
    offer: null
  },
  activeCall: {
    status: false,
    chat: { chatType: '', chatId: '' },
    contact: {
      chatId: '',
      _id: 0,
      username: '',
      profile: {
        image: { small: { name: '' } }
      },
      online: true
    },
    remoteStream: null,
    type: '',
    muted: false,
    cameraFacingMode: 'front',
    speaker: false
  }
};

export const videoCallReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'set_rtc_peer_connection':
      return {
        ...state,
        RTCConnection: action.payload
      };
    case 'receive_incoming_call':
      return {
        ...state,
        incomingCall: {
          chatType: action.payload.chatType,
          chatId: action.payload.chatId,
          callerId: action.payload.callerId,
          callerName: action.payload.callerName,
          callerProfile: action.payload.callerProfile,
          offer: action.payload.offer,
        }
      };
    case 'set_local_stream':
      return { ...state, localStream: action.payload };
    case 'set_remote_stream':
      return { 
        ...state, 
        activeCall: {
          ...state.activeCall,
          remoteStream: action.payload 
        }
      };
    case 'set_active_call_status':
      return {
        ...state,
        activeCall: {
          ...state.activeCall,
          status: action.payload
        }
      };
    default:
      return state;
  }
};