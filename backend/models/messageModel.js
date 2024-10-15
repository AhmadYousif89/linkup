import mongoose from 'mongoose';

// Creating message model
const messageModel = mongoose.Schema(
  {
    content: { type: String, trim: true }, // message content
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // user who sent the message
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, // the chat that owns this message
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // list of users who read the message
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', messageModel);

export default Message;
