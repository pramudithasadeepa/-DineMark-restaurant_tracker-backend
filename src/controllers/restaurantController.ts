import type { ParamsDictionary } from 'express-serve-static-core';
import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { RestaurantInput } from '../types';

const parseRouteId = (id: string | string[]): number =>
  parseInt(Array.isArray(id) ? id[0] : id, 10);

export const getRestaurants = async (req: AuthRequest, res: Response) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getRestaurantById = async (req: AuthRequest, res: Response) => {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: parseRouteId(req.params.id), userId: req.user!.id }
    });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const addRestaurant = async (req: AuthRequest<{}, {}, RestaurantInput>, res: Response) => {
  const { name, cuisine, location, priceRange, imageUrl, status, rating, review, visitedDate, whatIOrdered, recommendedDish, pricePaid } = req.body;
  
  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        cuisine,
        location,
        priceRange,
        imageUrl,
        status,
        rating: rating ? parseInt(rating.toString()) : undefined,
        review,
        visitedDate: visitedDate ? new Date(visitedDate) : undefined,
        whatIOrdered,
        recommendedDish,
        pricePaid: pricePaid ? parseFloat(pricePaid.toString()) : undefined,
        userId: req.user!.id
      }
    });
    res.status(201).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateRestaurant = async (
  req: AuthRequest<ParamsDictionary, unknown, RestaurantInput>,
  res: Response,
) => {
  const { name, cuisine, location, priceRange, imageUrl, status, rating, review, visitedDate, whatIOrdered, recommendedDish, pricePaid } = req.body;
  
  try {
    await prisma.restaurant.updateMany({
      where: { id: parseRouteId(req.params.id), userId: req.user!.id },
      data: {
        name,
        cuisine,
        location,
        priceRange,
        imageUrl,
        status,
        rating: rating ? parseInt(rating.toString()) : undefined,
        review,
        visitedDate: visitedDate ? new Date(visitedDate) : undefined,
        whatIOrdered,
        recommendedDish,
        pricePaid: pricePaid ? parseFloat(pricePaid.toString()) : undefined
      }
    });
    res.json({ message: 'Restaurant updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.restaurant.deleteMany({
      where: { id: parseRouteId(req.params.id), userId: req.user!.id }
    });
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const total = await prisma.restaurant.count({
      where: { userId: req.user!.id }
    });
    
    const visitedCount = await prisma.restaurant.count({
      where: { userId: req.user!.id, status: 'visited' }
    });
    
    const wantToTryCount = await prisma.restaurant.count({
      where: { userId: req.user!.id, status: 'want_to_try' }
    });
    
    const avgRating = await prisma.restaurant.aggregate({
      where: { userId: req.user!.id, status: 'visited', rating: { not: null } },
      _avg: { rating: true }
    });
    
    res.json({
      total,
      visitedCount,
      wantToTryCount,
      averageRating: avgRating._avg.rating || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};