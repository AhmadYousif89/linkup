import { Router } from 'express';
import { clerkClient, requireAuth } from '@clerk/express';

const router = Router();

// Check the authentication then return the user from clerk database
router.get(
  '/dashboard',
  requireAuth({ signInUrl: '/api/sign-in' }),
  async (req, res) => {
    try {
      const { userId } = req.auth;
      const user = await clerkClient.users.getUser(userId);
      return res.json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export default router;
