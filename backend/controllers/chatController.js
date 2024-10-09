import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModels.js';
import User from '../models/userModel.js';

class ChatController {
  // Views chat with a certain user, require userId
  // post /api/chat/
  static accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (req.user._id.toString() === userId) {
      console.log('Cannot create chat with yourself');
      return res
        .status(400)
        .json({ error: 'Cannot create chat with yourself' });
    }
    // Search for chats that has the userId
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    if (isChat.length > 0) {
      // If there are chats, then send them
      res.json(isChat[0]);
    } else {
      // If there are no chats, then create one
      let chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const Fullchat = await Chat.findOne({ _id: createdChat._id }).populate(
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

  // Search for chats for our user
  // get /api/chat/
  static fetchChat = asyncHandler(async (req, res) => {
    try {
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
          return res.status(200).json(results);
        });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'cannot find userchat' });
    }
  });

  // Create a new group chat
  // require name of the group and the users ids (min 3 including the current user)
  // post /api/chat/group
  static createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ error: 'Please fill all the fields' });
    }

    // Check if all users exist
    let usersIds = JSON.parse(req.body.users);
    // Add logged in user to users list
    usersIds.push(req.user._id.toString());
    // Remove any duplicates
    usersIds = [...new Set(usersIds)];

    if (usersIds.length < 3) {
      console.log('Please select at least 3 users for the group chat');
      return res
        .status(400)
        .json({ error: 'Please select at least 3 users for the group chat' });
    }

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: usersIds,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

      res.status(200).json(fullGroupChat);
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ error: 'cannot create group chat' });
    }
  });

  // Rename group
  // require chatId and chatName
  // put /api/chat/rename
  static renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId } = req.body;
    let { chatName } = req.body;
    if (!chatId) {
      return res.status(400).json({ error: 'Please enter chat id' });
    }

    const group = await Chat.findById(chatId);

    if (!group) {
      console.log('Chat not found');
      return res.status(400).json({ error: 'Chat not found' });
    }

    // Check if the chat is not a group
    if (!group.isGroupChat) {
      console.log('Cannot change name of DM');
      return res
        .status(400)
        .json({ error: 'Cannot change name of private chat' });
    }

    // Check if user in the group
    if (!group.users.includes(req.user._id.toString())) {
      console.log('You are not in the group');
      return res.status(400).json({ error: 'You are not in the group' });
    }

    if (!chatName || chatName.trim() === '') {
      chatName = 'Unnamed Group';
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      console.log('Chat not found');
      return res.status(400).json({ error: 'Chat not found' });
    } else {
      res.status(200).json(updatedChat);
    }
  });
}

// Add to group
// require chatId and userId, and to be in the group
// put /api/chat/groupadd
ChatController.addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!userId) {
    console.log('Please enter userId');
    return res.status(400).json({ error: 'Please enter userId' });
  }

  const isUser = await User.findById(userId);
  if (!isUser) {
    console.log('Cannot find user');
    return res.status(400).json({ error: 'Cannot find user' });
  }

  const group = await Chat.findById(chatId);

  if (!group) {
    console.log('Chat not found');
    return res.status(400).json({ error: 'Chat not found' });
  }

  // Check if the chat is not a group
  if (!group.isGroupChat) {
    console.log('Cannot add to a DM');
    return res.status(400).json({ error: 'Cannot add to a private chat' });
  }

  // Check if user in the group
  if (!group.users.includes(req.user._id.toString())) {
    console.log('You are not in the group');
    return res.status(400).json({ error: 'You are not in the group' });
  }

  if (group.users.includes(userId)) {
    console.log('User is already in the group');
    return res.status(400).json({ error: 'User is already in the group' });
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  return res.status(200).json(added);
});

// Remove from group
// require chatId, userId, and to be groupAdmin
// put /api/chat/groupremove
ChatController.removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!userId) {
    console.log('Please enter userId');
    return res.status(400).json({ error: 'Please enter userId' });
  }

  let group = await Chat.findById(chatId);

  if (!group) {
    console.log('Chat not found');
    return res.status(400).json({ error: 'Chat not found' });
  }

  group.populate('groupAdmin', '_id');

  // Check if user is admin
  if (group.groupAdmin._id.toString() !== req.user._id.toString()) {
    console.log('Only the group admin can remove from group');
    return res
      .status(400)
      .json({ error: 'Only the group admin can remove from group' });
  }

  const isUser = await User.findById(userId);
  if (!isUser) {
    console.log('Cannot find user');
    return res.status(400).json({ error: 'Cannot find user' });
  }

  if (userId === req.user._id.toString()) {
    console.log('cannot remove yourself');
    return res.status(400).json({ error: 'cannot remove yourself' });
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    console.log('Chat not found');
    return res.status(400).json({ error: 'Chat not found' });
  } else {
    res.status(200).json(removed);
  }
});

// Delete group
// require chatId, and to be groupAdmin
// delete /api/chat/groupdelete
ChatController.deleteGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  let group;

  // Checking group
  try {
    group = await Chat.findById(chatId).populate('groupAdmin', '_id');

    if (!group) {
      console.log('Chat not found');
      return res.status(400).json({ error: 'Chat not found' });
    }
  } catch (error) {
    console.log('Chat not found');
    return res.status(400).json({ error: 'Chat not found' });
  }

  // Check if user is admin
  if (group.groupAdmin._id.toString() !== req.user._id.toString()) {
    console.log('Only the group admin can delete the group');
    return res
      .status(400)
      .json({ error: 'Only the group admin can delete the group' });
  }

  const deletedChat = await Chat.findByIdAndDelete(chatId);
  return res.status(200).json({
    message: `chat ${deletedChat.chatName} ${deletedChat._id} deleted successfully`,
  });
});

// Quit group
// require chatId
// put /api/chat/groupquit
ChatController.quitGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const user = req.user;

  let group = await Chat.findById(chatId);

  if (!group) {
    console.log('Chat not found');
    return res.status(400).json({ error: 'Chat not found' });
  }

  // Check if the chat is not a group
  if (!group.isGroupChat) {
    console.log('Cannot quit from a DM');
    return res.status(400).json({ error: 'Cannot quit from a private chat' });
  }

  group.populate('groupAdmin', '_id');

  // Check if user in the group
  if (!group.users.includes(user._id.toString())) {
    console.log('You are not in this group');
    return res.status(400).json({ error: 'You are not in this group' });
  }

  // Check if the user is groupAdmin and there are still users in chat
  if (
    group.groupAdmin._id.toString() === user._id.toString() &&
    group.users.length > 1
  ) {
    const firstMemberId = group.users.find(
      (member) => member.toString() !== group.groupAdmin._id.toString()
    );
    const firstMember = await User.findById(firstMemberId);
    await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: { groupAdmin: firstMemberId },
        $pull: { users: user._id },
      },
      { new: true }
    );

    return res.status(200).json({
      message: `removed from ${group.chatName} successfully, new admin is ${firstMember.name}`,
    });
  } else if (group.users.length === 1) {
    return ChatController.deleteGroup(req, res);
  } else {
    await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: user._id },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: `removed from ${group.chatName} successfully` });
  }
});

export default ChatController;
