const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const searchContacts = async (req, res, next) => {
  const { username } = req.body;
  let { search } = req.body;
  search = search.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");

  try {
    if (search) {
      const contacts = await User.find({ username: { $regex: new RegExp(search, 'i'), $ne: username } }, { username: 1, profile: 1, _id: 0 }).limit(10);
      if (contacts.length == 0) {
        return res.send({ contacts: [] });
      }

      return res.send({ contacts });
    }
    res.send({ contacts: [] });  
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  searchContacts
};