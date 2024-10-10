import { Router } from 'express';
import MessageController from '../controllers/messageController.js';
import verifyToken from '../middleware/authMiddleware.js';

// /api/message/
const router = Router();

// Send a message
router.post('/', verifyToken, MessageController.sendMessage);

// Get all messages from a certain chat
router.get('/:chatId', verifyToken, MessageController.allMessage);

export default router;
