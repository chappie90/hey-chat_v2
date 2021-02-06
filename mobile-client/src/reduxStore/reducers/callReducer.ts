import { Reducer } from 'redux';

type CallState = {
  call: TCall;
};

const INITIAL_STATE: CallState = {
  call: {
    callId: '',
    isActive: false,
    isInitiatingCall: false,
    isReceivingCall: false,
    isRequestingVideo: false,
    isReceivingVideoRequest: false,
    hasEnded: true,
    offer: null,
    chat: { chatType: 'private', chatId: '' },
    caller: {
      _id: 0,
      username: '',
      avatar: { small: '' },
      online: true
    },
    callee: {
      _id: 0,
      username: '',
      avatar: { small: '' },
      online: true
    },
    localStream: null,
    remoteStream: null,
    RTCConnection: null,
    type: '',
    localVideoEnabled: false,
    remoteVideoEnabled: false,
    muted: false,
    cameraFacingMode: 'front',
    speaker: false
  }
};

export const callReducer: Reducer = (state = INITIAL_STATE, action) => {
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
          callId: action.payload.callId,
          isInitiatingCall: true,
          isRequestingVideo: action.payload.type === 'audio' ? false : true,
          hasEnded: false,
          chat: {
            ...state.call.chat,
            chatId: action.payload.chatId
          },
          caller: {
            ...state.call.caller,
            _id: action.payload.caller._id,
            username: action.payload.caller.username,
            avatar: {
              small: action.payload.caller.avatar.small,
              medium: action.payload.caller.avatar.medium
            }
          },
          callee: {
            ...state.call.callee,
            _id: action.payload.callee._id,
            username: action.payload.callee.username,
            avatar: {
              small: action.payload.callee.avatar.small,
              medium: action.payload.callee.avatar.medium
            }
          },
          localVideoEnabled: action.payload.type === 'audio' ? false : true,
          remoteVideoEnabled: action.payload.type === 'audio' ? false : true,
          type: action.payload.type
        }
      };
    case 'receive_call':
      return {
        ...state,
        call: {
          ...state.call,
          callId: action.payload.callId,
          isReceivingCall: true,
          isReceivingVideoRequest: action.payload.type === 'audio' ? false : true,
          hasEnded: false,
          chat: {
            ...state.call.chat,
            chatId: action.payload.chatId
          },
          caller: {
            ...state.call.caller,
            chatId: action.payload.chatId,
            _id: action.payload.caller._id,
            username: action.payload.caller.username,
            avatar: {
              small: action.payload.caller.avatar.small
            }
          },
          callee: {
            ...state.call.callee,
            _id: action.payload.callee._id,
            username: action.payload.callee.username,
            avatar: {
              small: action.payload.callee.avatar.small
            }
          },
          localVideoEnabled: action.payload.type === 'audio' ? false : true,
          remoteVideoEnabled: action.payload.type === 'audio' ? false : true,
          type: action.payload.type
        }
      };
    case 'set_offer':
      return {
        ...state,
        call: {
          ...state.call,
          offer: action.payload
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
    case 'start_call':
      return {
        ...state,
        call: {
          ...state.call,
          isActive: true,
          isInitiatingCall: false,
          isReceivingCall: false
        }
      };
    case 'end_call':
      return {
        ...state,
        call: {
          ...INITIAL_STATE.call
        }
      };
    case 'toggle_speaker':
      return {
        ...state,
        call: {
          ...state.call,
          speaker: !state.call.speaker
        }
      };
    case 'toggle_mute_call':
      return {
        ...state,
        call: {
          ...state.call,
          muted: !state.call.muted
        }
      };
    case 'toggle_local_stream':
      return {
        ...state,
        call: {
          ...state.call,
          localVideoEnabled: !state.call.localVideoEnabled
        }
      };
    case 'toggle_remote_stream':
      return {
        ...state,
        call: {
          ...state.call,
          remoteVideoEnabled: !state.call.remoteVideoEnabled
        }
      };
    case 'request_video':
      return {
        ...state,
        call: {
          ...state.call,
          isRequestingVideo: action.payload
        }
      };
      case 'receive_video_request':
    return {
      ...state,
      call: {
        ...state.call,
        isReceivingVideoRequest: action.payload
      }
    };
    default:
      return state;
  }
};