import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type CallState = {
  call: TCall;
};

type CallAction =
  | { type: 'set_rtc_peer_connection'; payload: any }
  | { type: 'initiate_call'; payload: { callId: string, chatId: string, caller: TContact, callee: TContact, type: string } }
  | { type: 'receive_call'; payload: { callId: string, chatId: string; caller: TContact, callee: TContact, type: string } }
  | { type: 'set_offer'; payload: any }
  | { type: 'end_call' }
  | { type: 'set_local_stream'; payload: any }
  | { type: 'set_remote_stream'; payload: any }
  | { type: 'start_active_call'; payload: { chatId: string; contact: TContact } }
  | { type: 'toggle_speaker' }
  | { type: 'toggle_mute_call' }
  | { type: 'toggle_local_stream' }
  | { type: 'toggle_remote_stream' }
  | { type: 'request_video', payload: boolean }
  | { type: 'receive_video_request', payload: boolean };

const setRTCPeerConnection = (connection: any) => ({ type: 'set_rtc_peer_connection', payload: connection }); 

const initiateCall = (
  callId: string,
  chatId: string,
  caller: TContact,
  callee: TContact,
  type: string
) => ({ type: 'initiate_call', payload: { callId, chatId, caller, callee, type } });

const receiveCall = (
  callId: string,
  chatId: string,
  caller: TContact,
  callee: TContact,
  type: string
) => ({ type: 'receive_call', payload: { callId, chatId, caller, callee, type } });

const setCallOffer = (offer: any) => ({ type: 'set_call_offer', payload: offer }); 

const setLocalStream = (localStream: any) => ({ type: 'set_local_stream', payload: localStream }); 

const setRemoteStream = (remoteStream: any) => ({ type: 'set_remote_stream', payload: remoteStream }); 

const startCall = () => ({ type: 'start_call' });

const endCall = () => ({ type: 'end_call' }); 

const toggleSpeaker = () => ({ type: 'toggle_speaker' }); 

const toggleMuteCall = () => ({ type: 'toggle_mute_call' }); 

const toggleLocalStream = () => ({ type: 'toggle_local_stream' }); 

const toggleRemoteStream = () => ({ type: 'toggle_remote_stream' }); 

const requestVideo = (state: boolean) => ({ type: 'request_video', payload: state }); 

const receiveVideoRequest = (state: boolean) => ({ type: 'receive_video_request', payload: state }); 

export default {
  setRTCPeerConnection,
  initiateCall,
  receiveCall,
  setCallOffer,
  endCall,
  setLocalStream,
  setRemoteStream,
  startCall,
  toggleSpeaker,
  toggleMuteCall,
  toggleLocalStream,
  toggleRemoteStream,
  requestVideo,
  receiveVideoRequest
};