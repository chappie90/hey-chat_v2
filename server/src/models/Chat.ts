import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  createDate: { 
    type: Date, 
    default: Date.now() 
  },
  creator: String,
  image: {
    name: String
  }
});

mongoose.model('Chat', chatSchema);