import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModels.js';
import User from '../models/userModel.js';

class ChatController {
  // Views chat with a certain user, require userId
  static accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId not found' });
    }
    // Search for chats that has the userId
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('user', '-password')
      .populate('latestMessage');

    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    if (isChat.length > 0) {
      // If there are chats, then send them
      res.send(isChat[0]);
    } else {
      // If there are no chats, then create one
      let chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const Fullchat = await Chat.findout({ _id: createdChat._id }).populate(
          'users',
          '-password'
        );
        res.status(201).json(Fullchat);
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'Cannot create Chat' });
      }
    }
  });

  static fetchChat = asyncHandler(async (req, res) => {
    try {
      // Search for chats for our user
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: 'latestMessage.sender',
            select: 'name pic email',
          });
          return res.status(200).send(results);
        });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'cannot find userchat' });
    }
  });
}

export default ChatController;
