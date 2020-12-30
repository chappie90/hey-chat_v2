import { Reducer } from 'redux';

type VideoCallState = {
  localStream: any;
  RTCConnection: any | null;
  incomingCall: {
    chatType: string;
    chatId: string;
    callerId: string;
    callerName: string;
    callerProfile: string;
    offer: any;
  };
  activeCall: {
    status: boolean;
    remoteStream: any;
  };
};

const INITIAL_STATE: VideoCallState = {
  localStream: null,
  RTCConnection: null,
  incomingCall: {
    chatType: '',
    chatId: '',
    callerId: '',
    callerName: '',
    callerProfile: '',
    offer: null
  },
  activeCall: {
    status: false,
    remoteStream: null
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