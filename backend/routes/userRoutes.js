import { Router } from 'express';
import UserController from '../controllers/userController.js';

const router = Router();

// Create a new user
router.post('/signup', UserController.registerUser);

// Check the authentication
router.post('/login', UserController.authUser);

export default router;
