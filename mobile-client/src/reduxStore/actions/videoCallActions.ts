import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type VideoCallState = {
  RTCPeerConnection: any | null;
  incomingCall: {
    callerId: string;
    callerName: string;
    offer: any | null;
  };
};

type VideoCallAction =
  | { type: 'set_rtc_peer_connection'; payload: any }
  | { type: 'receive_incoming_call'; payload: string };

const setRTCPeerConnection = (connection: any) => ({ type: 'set_rtc_peer_connection', payload: connection }); 

const receiveIncomingCall = (callerId: string, callerName: string, offer: any) => {
  return { type: 'receive_incoming_call', payload: { callerId, callerName, offer } }
};

export default {
  setRTCPeerConnection,
  receiveIncomingCall
};