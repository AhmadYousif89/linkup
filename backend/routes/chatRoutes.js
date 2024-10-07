import { Router } from 'express';
import ChatController from '../controllers/chatController.js';

const router = Router();

// Views chat with a certain user, require userId
router.post('/', ChatController.accessChat);

// Search for chats for our user
router.get('/', ChatController.fetchChat);

export default router;
