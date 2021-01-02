import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type VideoCallState = {
  call: TCall;
};

type VideoCallAction =
  | { type: 'set_rtc_peer_connection'; payload: any }
  | { type: 'initiate_call'; payload: { uuid: string, chatId: string, caller: TContact, callee: TContact, type: string } }
  | { type: 'receive_call'; payload: { callId: string, chatId: string; caller: TContact,  offer: any, type: string } }
  | { type: 'unset_incoming_call' }
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

const receiveCall = (
  callId: string,
  chatId: string,
  caller: TContact,
  callee: TContact,
  offer: any,
  type: string
) => {
  return { type: 'receive_call', payload: { callId, chatId, caller, callee, offer, type } }
};

const unsetCall = () => ({ type: 'unset_call' }); 

const setLocalStream = (localStream: any) => ({ type: 'set_local_stream', payload: localStream }); 

const setRemoteStream = (remoteStream: any) => ({ type: 'set_remote_stream', payload: remoteStream }); 

const startActiveCall = (chatId: string, contact: TContact) => ({ type: 'start_active_call', payload: { chatId, contact } });

const endActiveCall = () => ({ type: 'end_active_call' }); 

const toggleMuteActiveCall = () => ({ type: 'toggle_mute_call' }); 

export default {
  setRTCPeerConnection,
  initiateCall,
  receiveCall,
  unsetCall,
  setLocalStream,
  setRemoteStream,
  startActiveCall,
  endActiveCall,
  toggleMuteActiveCall
};