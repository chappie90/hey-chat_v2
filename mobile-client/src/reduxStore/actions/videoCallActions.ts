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
  | { type: 'receive_incoming_call'; payload: string }
  | { type: 'set_local_stream'; payload: any }
  | { type: 'set_remote_stream'; payload: any }
  | { type: 'set_active_call_status'; payload: any };

const setRTCPeerConnection = (connection: any) => ({ type: 'set_rtc_peer_connection', payload: connection }); 

const receiveIncomingCall = (
  chatType: string,
  chatId: string,
  callerId: string, 
  callerName: string, 
  callerProfile: string, 
  offer: any
) => {
  return { type: 'receive_incoming_call', payload: { chatType, chatId, callerId, callerName, callerProfile, offer } }
};

const setLocalStream = (localStream: any) => ({ type: 'set_local_stream', payload: localStream }); 

const setRemoteStream = (remoteStream: any) => ({ type: 'set_remote_stream', payload: remoteStream }); 

const setActiveCallStatus = (activeStatus: boolean) => ({ type: 'set_active_call_status', payload: activeStatus }); 

export default {
  setRTCPeerConnection,
  receiveIncomingCall,
  setLocalStream,
  setRemoteStream,
  setActiveCallStatus
};