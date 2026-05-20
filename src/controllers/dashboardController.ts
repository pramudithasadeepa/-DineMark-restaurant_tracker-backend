import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const restaurants = await prisma.restaurant.findMany({
      where: { userId }
    });
    
    const totalRestaurants = restaurants.length;
    const visitedCount = restaurants.filter(r => r.status === 'visited').length;
    const wantToTryCount = restaurants.filter(r => r.status === 'want_to_try').length;
    
    const ratedRestaurants = restaurants.filter(r => r.rating);
    const averageRating = ratedRestaurants.length > 0
      ? ratedRestaurants.reduce((acc, r) => acc + (r.rating || 0), 0) / ratedRestaurants.length
      : 0;
    
    const totalSpent = restaurants
      .filter(r => r.pricePaid)
      .reduce((acc, r) => acc + (r.pricePaid || 0), 0);
    
    // Recent restaurants
    const recentRestaurants = restaurants.slice(0, 5);
    
    res.json({
      totalRestaurants,
      visitedCount,
      wantToTryCount,
      averageRating,
      totalSpent,
      recentRestaurants
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getCuisineStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const restaurants = await prisma.restaurant.findMany({
      where: { userId }
    });
    
    const cuisineCount: { [key: string]: number } = {};
    restaurants.forEach(r => {
      cuisineCount[r.cuisine] = (cuisineCount[r.cuisine] || 0) + 1;
    });
    
    res.json(cuisineCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};