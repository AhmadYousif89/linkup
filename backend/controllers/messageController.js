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

    if (!content || !content.trim() || !chatId) {
      console.log('Invalid data passed into request');
      return res.status(400).json('Invalid data passed into request');
    }

    // check if chat exist and if user in it
    try {
      const chat = await Chat.findById(chatId).populate('users', '_id');

      if (!chat) {
        console.log('Chat not found');
        return res.status(400).json('Chat not found');
      }

      const currentUser = chat.users.find(
        (user) => user._id.toString() === req.user._id.toString(),
      );

      if (!currentUser) {
        console.log('User not found in chat');
        return res.status(400).json('User not found in chat');
      }
    } catch (error) {
      console.log(`Error: Chat not found, ${error.message}`);
      return res.status(400).json('Error: Chat not found');
    }

    let newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    try {
      let message = await Message.create(newMessage);
      message = await message.populate('sender', 'name pic');
      message = await message.populate('chat');
      message = await User.populate(message, { path: 'chat.users', select: 'name pic' });

      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
      const data = {
        id: message._id,
        text: message.content,
        sender: {
          id: message.sender._id,
          name: message.sender.name,
          image: message.sender.pic,
        },
        chat: {
          id: message.chat._id,
          name: message.chat.chatName,
          isGroup: message.chat.isGroupChat,
          users: message.chat.users.map((user) => ({
            id: user._id,
            name: user.name,
            image: user.pic,
          })),
          latestMessage: message.chat.latestMessage,
        },
        readBy: message.readBy,
        timestamp: message.createdAt,
      };
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Failed to send message' });
    }
  });

  // get all messages in a chat
  // chatId is required
  // get /api/message/:chatId
  static allMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    // check if chat exist and if user in it
    try {
      const chat = await Chat.findById(chatId).populate('users', '_id');

      if (!chat) {
        console.log('Chat not found');
        return res.status(400).json('Chat not found');
      } else if (!chat.users.find((user) => user._id.toString() === req.user._id.toString())) {
        console.log('User not found in chat');
        return res.status(400).json('User not found in chat');
      }
    } catch (error) {
      console.log(`Error: Chat not found, ${error.message}`);
      return res.status(400).json('Error: Chat not found');
    }

    try {
      const chatId = req.params.chatId;
      const messages = await Message.find({ chat: chatId })
        .populate('sender', 'name pic email')
        .populate('chat');
      const data = messages.map((message) => ({
        id: message._id,
        text: message.content,
        sender: {
          id: message.sender._id,
          name: message.sender.name,
          image: message.sender.pic,
        },
        chat: {
          id: message.chat._id,
          name: message.chat.chatName,
          isGroup: message.chat.isGroupChat,
          users: message.chat.users.map((user) => ({
            id: user._id,
            name: user.name,
            image: user.pic,
          })),
          latestMessage: message.chat.latestMessage,
        },
        readBy: message.readBy,
        timestamp: message.createdAt,
      }));
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Failed to fetch messages' });
    }
  });
}

export default MessageController;
