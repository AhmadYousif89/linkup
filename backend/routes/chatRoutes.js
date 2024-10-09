import { Router } from 'express';
import ChatController from '../controllers/chatController.js';
import verifyToken from '../middleware/authMiddleware.js';

// /api/chat/
const router = Router();

// Views chat with a certain user, require userId
router.post('/', verifyToken, ChatController.accessChat);

// Search for chats for our user
router.get('/', verifyToken, ChatController.fetchChat);

// Create a group chat
router.post('/group', verifyToken, ChatController.createGroupChat);

// Rename a group chat
router.put('/rename', verifyToken, ChatController.renameGroupChat);

// Add to group
router.put('/groupadd', verifyToken, ChatController.addToGroup);

// Remove from group
router.put('/groupremove', verifyToken, ChatController.removeFromGroup);

// Delete group
router.delete('/groupdelete', verifyToken, ChatController.deleteGroup);

// Quit group
router.put('/groupquit', verifyToken, ChatController.quitGroup);

export default router;
