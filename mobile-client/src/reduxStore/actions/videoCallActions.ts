import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type VideoCallState = {
  incomingCall: {
    callerId: string;
    callerName: string;
    offer: any | null;
  };
};

type VideoCallAction =
  | { type: 'receive_incoming_call'; payload: string };

const receiveIncomingCall = (callerId: string, callerName: string, offer: any) => {
  return { type: 'receive_incoming_call', payload: { callerId, callerName, offer } }
};

export default {
  receiveIncomingCall
};