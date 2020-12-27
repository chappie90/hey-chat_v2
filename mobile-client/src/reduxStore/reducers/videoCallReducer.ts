import { Reducer } from 'redux';

type VideoCallState = {
  RTCPeerConnection: any | null;
  incomingCall: {
    callerId: string;
    callerName: string;
    offer: any;
  };
};

const INITIAL_STATE: VideoCallState = {
  RTCPeerConnection: null,
  incomingCall: {
    callerId: '',
    callerName: '',
    offer: null
  }
};

export const videoCallReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'set_rtc_peer_connection':
      return {
        ...state,
        RTCPeerConnection: action.payload
      };
    case 'receive_incoming_call':
      return {
        ...state,
        incomingCall: {
          callerId: action.payload.callerId,
          callerName: action.payload.callerName,
          offer: action.payload.offer,
        }
      };
    default:
      return state;
  }
};