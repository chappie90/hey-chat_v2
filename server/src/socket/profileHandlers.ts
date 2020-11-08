import { Socket } from 'socket.io';
const mongoose = require('mongoose');

const User = mongoose.model('User');

// User updates profile image
export const onUpdateProfileImage = async (
  socket: Socket, 
  data: string
): Promise<void> => {
  const { userId } = JSON.parse(data);

  const user = await User.findOne({ _id: userId });
  const newProfileImage = user.profile.image.small.path;

  // Notify all active contacts of new profile image
  const imageData = { userId, profileImage: newProfileImage };
  socket.broadcast.to(userId).emit('profile_image_updated', JSON.stringify(imageData));
};
