import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Chat = mongoose.model('Chat');

const getChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.query;

  try {
    const user = await User.find(
      { _id: userId }
    ).populate('chats');

    const chats = user[0].chats;

    console.log(chats)

    res.status(200).send({ chats });
  } catch (err) {
    next(err);
  }
};

export default {
  getChats
};