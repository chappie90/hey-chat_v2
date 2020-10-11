import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');

const User = mongoose.model('User');
import { TUser, TContact } from '../types/index';

const searchContacts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username } = req.query;

  let search = req.query.search;
  search = (search as string).replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");

  try {
    const contacts = await User.find({ 
      username: { 
        $regex: new RegExp(search, 'i'),
        $ne: username 
      } 
    }, 
    { username: 1, 'profile.image.name': 1 }).limit(10);

    res.status(200).send({ contacts });  
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getContacts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.query;

  try {
    const user: TUser = await User.findOne(
      { _id: userId }
    ).lean()
     .populate('pendingContacts', 'username')
     .populate('contacts', 'username')
     .populate('chats', 'chatId participants')
     .populate('archivedChats', 'participants');

    const chats = [ ...user.chats, ...user.archivedChats ];
    const pendingContacts: TContact[] = user.pendingContacts.map((pC: TContact) => ({ ...pC, pending: true }));
    const contacts: TContact[] = [ ...pendingContacts, ...user.contacts ];

    // Get id of chat between user and each contact
    for (const contact of contacts) {
      const chatId: string = chats.filter(chat => chat.participants.filter((p: any) => p === contact._id))[0].chatId;
      contact.chatId = chatId;
    }

    res.status(200).send({ contacts });
  } catch (err) {
    next(err);
  }
};

export default {
  searchContacts,
  getContacts
};