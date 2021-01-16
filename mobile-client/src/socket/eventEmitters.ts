
export const emitNewMessage = (data: string, socket: any) => {
  socket.emit('message', data);
};

export const emitUpdateProfileImage = (data: string, socket: any) => {
  socket.emit('update_profile_image', data);
};

export const emitLikeMessage = (data: string, socket: any) => {
  socket.emit('like_message', data);
};

export const emitDeleteMessage = (data: string, socket: any) => {
  socket.emit('delete_message', data);
};

export const emitMarkAllMessagesAsRead = (data: string, socket: any) => {
  socket.emit('mark_messages_as_read', data);
};

export const emitStartTyping = (data: string, socket: any) => {
  socket.emit('start_typing', data);
};

export const emitStopTyping = (data: string, socket: any) => {
  socket.emit('stop_typing', data);
};

export const emitSendSdpOffer = (data: string, socket: any) => {
  socket.emit('send_sdp_offer', data);
};

export const emitSendICECandidate = (data: string, socket: any) => {
  socket.emit('send_ice_candidate', data);
};

export const emitSendSdpAnswer = (data: string, socket: any) => {
  socket.emit('send_sdp_answer', data);
};

export const emitEndCall = (data: string, socket: any) => {
  console.log('emitting end call')
  socket.emit('end_call', data);
};