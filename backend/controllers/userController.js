/* eslint-disable indent */
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../config/generateToken.js';

class UserController {
  // Register a new user, take what is required from the body
  // name, email, and password, email MUST be unique
  // post /api/user/signup
  static registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    // Validation
    if (!name) {
      console.error('Please enter the name');
      return res.status(400).json({ error: 'Please enter the name' });
    }

    if (!email) {
      console.error('Please enter the email');
      return res.status(400).json({ error: 'Please enter the email' });
    }

    if (!password) {
      console.error('Please enter the password');
      return res.status(400).json({ error: 'Please enter the password' });
    }
    const userExist = await User.findOne({ email });

    if (userExist) {
      console.error('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      console.error('Failed to create the user');
      return res.status(400).json({ error: 'Failed to create the user' });
    }
  });

  // Check the authentication, Login method
  // post /api/user/login
  static authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      console.error('Please enter the email and password');
      return res
        .status(400)
        .json({ error: 'Please enter the email and password' });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      console.error('Invalid email or password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  });

  // Search for user using query
  // /api/user?search=John
  static allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select('-password')
      .select('-__v');
    res.send(users);
  });
}

export default UserController;
