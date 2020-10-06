import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  type: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  requestAccepted: { type: Boolean, default: false },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  muted: {
    type: Boolean,
    required: true,
    default: false
  },
  creator: String,
  image: {
    name: String
  }
});

mongoose.model('Chat', chatSchema);