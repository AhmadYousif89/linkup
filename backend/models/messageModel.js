import mongoose from "mongoose";

const typeObjectId = mongoose.Schema.Types.ObjectId;

// Creating message model
const messageModel = mongoose.Schema(
  {
    sender: { type: typeObjectId, ref: "User" },
    chat: { type: typeObjectId, ref: "Chat" },
    text: { type: String, trim: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageModel);

export default Message;
