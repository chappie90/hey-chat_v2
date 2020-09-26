const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const signup = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if username already taken
    const checkAvailability = await User.find({ username: username });
    if (checkAvailability.length > 0) {
      return res.status(422).send({ message: 'Username already taken' });
    }

    // Create new user
    const newUser = new User({ username, password });
    await newUser.save();

    // Issue json web token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.status(200).send({ userId: newUser._id, username: newUser.username, token });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).send({ message: 'Please enter email and password' });
  }

  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(422).send({ message: 'Invalid username or password' });
  }

  try {
    // Check password and issue json web token
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ userId: user._id, username: user.username, token, });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  signup,
  signin
};