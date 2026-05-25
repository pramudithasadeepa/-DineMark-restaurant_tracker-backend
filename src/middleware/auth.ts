import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import { Request, Response, NextFunction } from 'express';
import admin from '../utils/firebaseAdmin';
import prisma from '../utils/prisma';

export interface AuthUser {
  id: string;
  email: string;
  firebaseUid: string;
}

export interface AuthRequest<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: AuthUser;
}

export const authenticateToken = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found in database' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firebaseUid: user.firebaseUid
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};