import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import restaurantRoutes from './routes/restaurants';
import dashboardRoutes from './routes/dashboard';

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Restaurant Tracker API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});