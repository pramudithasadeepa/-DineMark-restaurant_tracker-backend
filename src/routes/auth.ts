import { Router } from 'express';
import { googleSignIn, signUp, signIn, getMe, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/google', googleSignIn);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);

export default router;
