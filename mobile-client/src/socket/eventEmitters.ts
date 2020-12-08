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

// socket.on('message', (message: string) => {
//   console.log(message);
// });