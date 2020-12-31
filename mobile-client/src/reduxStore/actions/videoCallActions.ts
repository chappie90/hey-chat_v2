import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type VideoCallState = {
  localStream: any | null;
  RTCConnection: any | null;
  incomingCall: TIncomingCall;
  activeCall: TActiveCall
};

type VideoCallAction =
  | { type: 'set_rtc_peer_connection'; payload: any }
  | { type: 'set_incoming_call'; payload: { chatId: string; caller: TContact, offer: any } }
  | { type: 'unset_incoming_call' }
  | { type: 'set_local_stream'; payload: any }
  | { type: 'set_remote_stream'; payload: any }
  | { type: 'start_active_call'; payload: { chatId: string; contact: TContact } }
  | { type: 'end_active_call' }
  | { type: 'toggle_mute_call' };

const setRTCPeerConnection = (connection: any) => ({ type: 'set_rtc_peer_connection', payload: connection }); 

const setIncomingCall = (
  chatId: string,
  caller: TContact,
  offer: any
) => {
  return { type: 'set_incoming_call', payload: { chatId, caller, offer } }
};

const unsetIncomingCall = () => ({ type: 'unset_incoming_call' }); 

const setLocalStream = (localStream: any) => ({ type: 'set_local_stream', payload: localStream }); 

const setRemoteStream = (remoteStream: any) => ({ type: 'set_remote_stream', payload: remoteStream }); 

const startActiveCall = (chatId: string, contact: TContact) => ({ type: 'start_active_call', payload: { chatId, contact } });

const endActiveCall = () => ({ type: 'end_active_call' }); 

const toggleMuteActiveCall = () => ({ type: 'toggle_mute_call' }); 

export default {
  setRTCPeerConnection,
  setIncomingCall,
  unsetIncomingCall,
  setLocalStream,
  setRemoteStream,
  startActiveCall,
  endActiveCall,
  toggleMuteActiveCall
};