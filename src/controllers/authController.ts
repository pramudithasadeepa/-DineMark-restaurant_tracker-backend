import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import admin from '../utils/firebaseAdmin';
import { AuthRequest } from '../middleware/auth';

const verifyAndSyncUser = async (idToken: string, provider: string, res: Response, bodyName?: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    if (!decodedToken.email) {
      return res.status(400).json({ message: 'Email is required in token' });
    }

    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: decodedToken.email,
          name: bodyName || decodedToken.name || decodedToken.email.split('@')[0],
          image: decodedToken.picture || null,
          firebaseUid: decodedToken.uid,
          provider
        }
      });
    } else {
      // Update info if it changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: bodyName || decodedToken.name || user.name,
          image: decodedToken.picture || user.image,
          provider
        }
      });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export const googleSignIn = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'No token provided' });
  await verifyAndSyncUser(idToken, 'GOOGLE', res);
};

export const signUp = async (req: Request, res: Response) => {
  const { idToken, name } = req.body;
  if (!idToken) return res.status(400).json({ message: 'No token provided' });
  await verifyAndSyncUser(idToken, 'EMAIL', res, name);
};

export const signIn = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'No token provided' });
  await verifyAndSyncUser(idToken, 'EMAIL', res);
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Since Firebase is stateless on the backend, we just return success
  res.json({ message: 'Logged out successfully' });
};
