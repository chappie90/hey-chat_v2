import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chat: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat' 
  },
  sender: {
    type: String,
    required: true
  },
  message: {
    id: String, 
    text: String,
    createDate: {
      type: Date,
      default: Date.now()
    }
  },
  delivered: { 
    type: Boolean, 
    default: false 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  deleted: { 
    type: Boolean, 
    default: false 
  },
  reply: { 
    origMsgId: String,
    origMsgText: String,
    origMsgSender: String
  },
  image: {
    name: String
  }
});

mongoose.model('Message', messageSchema);