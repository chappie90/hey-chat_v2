import { Reducer } from 'redux';

type VideoCallState = {
  call: TCall;
};

const INITIAL_STATE: VideoCallState = {
  call: {
    callId: '',
    isActive: false,
    isInitiatingCall: false,
    isReceivingCall: false,
    offer: null,
    chat: { chatType: 'private', chatId: '' },
    caller: {
      _id: 0,
      username: '',
      profile: {
        image: { small: { name: '' } }
      },
      online: true
    },
    callee: {
      _id: 0,
      username: '',
      profile: {
        image: { small: { name: '' } }
      },
      online: true
    },
    localStream: null,
    remoteStream: null,
    RTCConnection: null,
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
        call: {
          ...state.call,
          RTCConnection: action.payload
        }
      };
    case 'initiate_call':
      return {
        ...state,
        call: {
          ...state.call,
          uuid: action.payload.uuid,
          isInitiatingCall: true,
          chat: {
            ...state.call.chat,
            chatId: action.payload.chatId
          },
          caller: {
            ...state.call.caller,
            _id: action.payload.caller._id,
            username: action.payload.caller.username,
            profile: {
              image: { small: { name: action.payload.caller.profile.image.small.name } }
            }
          },
          callee: {
            ...state.call.callee,
            _id: action.payload.callee._id,
            username: action.payload.callee.username,
            profile: {
              image: { small: { name: action.payload.callee.profile.image.small.name } }
            }
          },
          type: action.payload.type
        }
      };
    case 'receive_call':
      return {
        ...state,
        call: {
          isReceivingCall: true,
          chat: {
            ...state.call.chat,
            chatId: action.payload.chatId
          },
          caller: {
            ...state.call.caller,
            chatId: action.payload.chatId,
            _id: action.payload.caller._id,
            username: action.payload.caller.username,
            profile: {
              image: { small: { name: action.payload.caller.profile.image.small.name } }
            }
          },
          callee: {
            ...state.call.callee,
            _id: action.payload.callee._id,
            username: action.payload.callee.username,
            profile: {
              image: { small: { name: action.payload.callee.profile.image.small.name } }
            }
          },
          offer: action.payload.offer,
          type: action.payload.type
        }
      };
    case 'unset_call':
      return {
        ...state,
        call: {
          ...INITIAL_STATE.call
        }
      };
    case 'set_local_stream':
      return {
        ...state,
        call: {
          ...state.call,
          localStream: action.payload
        }
      };
    case 'set_remote_stream':
      return {
        ...state,
        call: {
          ...state.call,
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