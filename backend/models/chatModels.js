import mongoose from "mongoose";

const typeObjectId = mongoose.Schema.Types.ObjectId;

// Creating chat model
const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: typeObjectId, ref: "User" }],
    latestMessage: { type: typeObjectId, ref: "Message" },
    groupAdmin: { type: typeObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

export default Chat;
