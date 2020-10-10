import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');
const User = mongoose.model('User');

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
    const user: TUser = await User.find(
      { _id: userId }
    ).lean()
     .populate('pendingContacts', 'username')
     .populate('contacts', 'username')
     .populate('chats', 'participants')
     .populate('archivedChats', 'participants');

    const chats = [ ...user[0].chats, ...user[0].archivedChats ];
    const pendingContacts: TContact[] = user[0].pendingContacts.map((pC: TContact) => ({ ...pC, pending: true }));
    const contacts: TContact[] = [ ...pendingContacts, ...user[0].contacts ];

    // Get id of chat between user and each contact
    for (const contact of contacts) {
      const chatId: number = chats.filter(chat => chat.participants.filter((p: number) => p === contact._id))[0]._id;
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