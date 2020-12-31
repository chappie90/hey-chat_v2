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
    chat: { chatType: 'private', chatId: '' },
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
    case 'set_incoming_call':
      return {
        ...state,
        incomingCall: {
          status: true,
          chat: {
            ...state.incomingCall.chat,
            chatId: action.payload.chatId
          },
          contact: {
            ...state.incomingCall.caller,
            chatId: action.payload.chatId,
            _id: action.payload.caller.callerId,
            username: action.payload.caller.callerName,
            profile: {
              image: { small: { name: action.payload.caller.callerProfile } }
            }
          },
          offer: action.payload.offer,
        }
      };
    case 'unset_incoming_call':
      return {
        ...state,
        incomingCall: {
          ...INITIAL_STATE.incomingCall
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
    case 'start_active_call':
      return {
        ...state,
        activeCall: {
          ...state.activeCall,
          status: true,
          chat: {
            ...state.activeCall.chat,
            chatId: action.payload.chatId
          },
          caller: {
            ...state.activeCall.contact,
            chatId: action.payload.chatId,
            _id: action.payload.contact.contactId,
            username: action.payload.contact.contactName,
            profile: {
              image: { small: { name: action.payload.contact.contactProfile } }
            }
          },
        }
      };
    case 'end_active_call':
      return {
        ...state,
        activeCall: {
          ...INITIAL_STATE.activeCall
        }
      };
    case 'toggle_mute_call':
      return {
        ...state,
        activeCall: {
          ...state.activeCall,
          muted: !state.activeCall.muted
        }
      };
    default:
      return state;
  }
};