import mongoose from 'mongoose';

// Creating chat model
const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true, default: 'Unnamed Group' },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    closedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatModel);

export default Chat;
