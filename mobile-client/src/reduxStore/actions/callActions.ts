import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type CallState = {
  call: TCall;
};

type CallAction =
  | { type: 'set_rtc_peer_connection'; payload: any }
  | { type: 'initiate_call'; payload: { uuid: string, chatId: string, caller: TContact, callee: TContact, type: string } }
  | { type: 'receive_call'; payload: { callId: string, chatId: string; caller: TContact,  offer: any, type: string } }
  | { type: 'end_call' }
  | { type: 'set_local_stream'; payload: any }
  | { type: 'set_remote_stream'; payload: any }
  | { type: 'start_active_call'; payload: { chatId: string; contact: TContact } }
  | { type: 'end_active_call' }
  | { type: 'toggle_mute_call' };

const setRTCPeerConnection = (connection: any) => ({ type: 'set_rtc_peer_connection', payload: connection }); 

const initiateCall = (
  callId: string,
  chatId: string,
  caller: TContact,
  callee: TContact,
  type: string
) => ({ type: 'initiate_call', payload: { callId, chatId, caller, callee, type } });

const setCallOffer = (offer: any) => ({ type: 'set_call_offer', payload: offer }); 

const endCall = () => ({ type: 'end_call' }); 

const setLocalStream = (localStream: any) => ({ type: 'set_local_stream', payload: localStream }); 

const setRemoteStream = (remoteStream: any) => ({ type: 'set_remote_stream', payload: remoteStream }); 

const startCall = () => ({ type: 'start_call' });

const endActiveCall = () => ({ type: 'end_active_call' }); 

const toggleMuteActiveCall = () => ({ type: 'toggle_mute_call' }); 

export default {
  setRTCPeerConnection,
  initiateCall,
  setCallOffer,
  endCall,
  setLocalStream,
  setRemoteStream,
  startCall,
  endActiveCall,
  toggleMuteActiveCall
};