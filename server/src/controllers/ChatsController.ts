import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Chat = mongoose.model('Chat');
const Message = mongoose.model('Message');
import { TMessage } from '../types/index';

const getChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.query;

  let chats,
      unreadMessagesCount: number;

  try {
    const user = await User.findOne(
      { _id: userId }
    ).lean()
     .populate('chats')
     .populate({
       path: 'chats',
       populate: {
         path: 'participants',
         model: 'User',
         select: '_id username profile'
       }
     });

    chats = user.chats;

    // Get last message to be displayed on each chat
    for (const chat of chats) {
      const lastMessage = await Message.find({ chatId: chat.chatId })
        .sort({ 'message.createDate': -1 })
        .limit(1);
      chat.lastMessage = lastMessage;
    } 

    res.status(200).send({ chats });
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { chatId } = req.query;

  try {
    const messages = await Message.find({ chatId })
                                  .sort({ 'message.createDate': -1 })
                                  .limit(20);
    
    const allMessagesLoaded = messages.length < 20 ? true : false;

    res.status(200).send({ messages, allMessagesLoaded });
  } catch (err) {
    next(err);
  }
};

const getMoreMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { chatId, page } = req.query;

  const offset = 20 * (+page - 1);

  try {
    const messages = await Message.find({ chatId })
                                  .skip(offset)
                                  .sort({ 'message.createDate': -1 })
                                  .limit(20);
    
    const allMessagesLoaded = messages.length < 20 ? true : false;

    res.status(200).send({ messages, allMessagesLoaded });
  } catch (err) {
    next(err);
  }
};

export default {
  getChats,
  getMessages,
  getMoreMessages
};