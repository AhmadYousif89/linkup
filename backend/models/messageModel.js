import mongoose from 'mongoose';

// Creating message model
const messageModel = mongoose.Schema(
  {
    content: { type: String, trim: true }, // message content
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // user who sent the message
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, // the chat that owns this message
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // list of users who read the message
    files: [
      {
        originalName: { type: String }, // original name of the uploaded file
        mimeType: { type: String }, // file type (e.g., image/png, application/pdf)
        size: { type: Number }, // file size in bytes
        url: { type: String }, // file URL
      },
    ],
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', messageModel);

export default Message;
