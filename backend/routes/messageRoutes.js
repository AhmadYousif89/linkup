import { Router } from 'express';
import MessageController from '../controllers/messageController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', verifyToken, MessageController.sendMessage);
router.get('/:chatId', verifyToken, MessageController.allMessage);

export default router;
