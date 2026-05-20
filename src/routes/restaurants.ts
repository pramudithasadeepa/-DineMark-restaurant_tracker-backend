import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getRestaurants,
  getRestaurantById,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getDashboardStats
} from '../controllers/restaurantController';

const router = Router();

router.use(authenticateToken);

router.get('/', getRestaurants);
router.get('/stats', getDashboardStats);
router.get('/:id', getRestaurantById);
router.post('/', addRestaurant);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;