import { Reducer } from 'redux';

type VideoCallState = {
  incomingCall: {
    callerId: string;
    callerName: string;
    offer: any;
  };
};

const INITIAL_STATE: VideoCallState = {
  incomingCall: {
    callerId: '',
    callerName: '',
    offer: null
  }
};

export const videoCallReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};