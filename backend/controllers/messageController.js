import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Message from '../models/messageModel.js';
import Chat from '../models/chatModels.js';

class MessageController {
  // send message to user
  // require content, chatId
  // post /api/message/
  static sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log('Invalid data passed into request');
      return res.status(400).json('Invalid data passed into request');
    }

    let newMessage = {
      sender: req.user._id,
      content: content,
      chatId: chatId,
    };

    try {
      let message = await Message.create(newMessage);
      message = await message.populate('sender', 'name pic').execPopulate();
      message = await message.populate('chat').execPopulate();
      message = await User.populate(message, {
        path: 'chat.users',
        select: 'name pic',
      });

      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Failed to send message' });
    }
  });

  // get all messages in a chat
  // chatId is required
  // get /api/message/:chatId
  static allMessage = asyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate('sender', 'name pic email')
        .populate('chat');
      return res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Failed to fetch messages' });
    }
  });
}

export default MessageController;
