import mongoose from 'mongoose';

// Creating message model
const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    text: { type: String, trim: true },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageModel);

export default Message;
