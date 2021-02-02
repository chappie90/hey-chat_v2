import { Dispatch } from 'redux';
import { mediaDevices } from 'react-native-webrtc';

import { callActions } from 'reduxStore/actions';

const startLocalStream = async (dispatch: Dispatch): Promise<any> => {
  try {
    // isFront will determine if the initial camera should face user or environment
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFront ? 'front' : 'environment';
    const videoSourceId = devices.find((device: any) => device.kind === 'videoinput' && device.facing === facing);
    const facingMode = isFront ? 'user' : 'environment';
    const constraints: any = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };

    const newStream = await mediaDevices.getUserMedia(constraints);

    dispatch(callActions.setLocalStream(newStream));

    return newStream;
  } catch (err) {
    console.log('Start local stream recipient method error');
    console.log(err);
  }
};

const stopLocalStream = (callState: TCall, dispatch: Dispatch) => {
  callState.localStream.getTracks().forEach((t: any) => t.stop());
  callState.localStream.release();
  dispatch(callActions.setLocalStream(null));
};

export default {
  startLocalStream,
  stopLocalStream
};