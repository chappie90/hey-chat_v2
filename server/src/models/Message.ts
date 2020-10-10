import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat',
    required: true
  },
  sender: { type: String, required: true },
  message: {
    id: { type: String, required: true }, 
    text: String,
    createDate: { type: Date, required: true }
  },
  delivered: { 
    type: Boolean, 
    required: true,
    default: false 
  },
  read: { 
    type: Boolean,
    required: true, 
    default: false 
  },
  deleted: { 
    type: Boolean, 
    required: true,
    default: false 
  },
  reply: { 
    origMsgId: Number,
    origMsgText: String,
    origMsgSender: String
  },
  image: {
    name: String
  }
});

mongoose.model('Message', messageSchema);