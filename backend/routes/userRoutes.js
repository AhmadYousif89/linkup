import { Router } from 'express';
import UserController from '../controllers/userController.js';
import verifyToken from '../middleware/authMiddleware.js';

// /api/user/
const router = Router();

// Create a new user
router.post('/signup', UserController.registerUser);

// Check the authentication
router.post('/login', UserController.authUser);

// Get all users, or use ?search=John to search
router.get('/', verifyToken, UserController.allUsers);

export default router;
