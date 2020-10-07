import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Chat = mongoose.model('Chat');
const Message = mongoose.model('Message');

const getChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.query;

  let chats,
      unreadMessagesCount: number;

  try {
    const user = await User.find(
      { _id: userId }
    ).lean()
     .populate('chats')
     .populate({
       path: 'chats',
       populate: {
         path: 'participants',
         model: 'User',
         select: '_id username'
       }
     });

    chats = user[0].chats;

    // Get last message to be displayed on each chat
    for (const chat of chats) {
      const lastMessage = await Message.find({ chat: chat._id })
        .sort({ 'message.createDate': -1 })
        .limit(1);
      chat.lastMessage = lastMessage;
    } 

    res.status(200).send({ chats });
  } catch (err) {
    next(err);
  }
};

export default {
  getChats
};