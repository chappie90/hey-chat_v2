
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

export const emitMakeOutgoingVideoCall = (data: string, socket: any) => {
  socket.emit('make_outgoing_video_call', data);
};

export const emitAcceptVideoCall = (data: string, socket: any) => {
  socket.emit('accept_video_call', data);
};

export const emitRejectVideoCall = (data: string, socket: any) => {
  socket.emit('reject_video_call', data);
};