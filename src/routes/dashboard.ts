import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getDashboardStats, getCuisineStats } from '../controllers/dashboardController';

const router = express.Router();

router.use(authenticateToken);
router.get('/stats', getDashboardStats);
router.get('/cuisine-stats', getCuisineStats);

export default router;