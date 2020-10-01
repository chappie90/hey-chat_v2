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

const addContact = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, contactId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { contacts: contactId } },
      { new: true }
    ).populate('contacts');

    // const contact = user.contacts.filter(c => c.)

    // console.log(user)
    // console.log(contact)

    res.status(200).send({ contact: {} });
  } catch (err) {
    next(err);
  }
};

export default {
  searchContacts,
  addContact
};