import { Router } from 'express';
import ChatController from '../controllers/chatController.js';

const router = Router();

router.post('/', ChatController.accessChat);
router.get('/', ChatController.fetchChat);

export default router;
