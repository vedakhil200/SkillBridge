import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import dotenv from 'dotenv';

import connectDB from './src/config/database.js';
import authRoutes from './src/routes/auth.js';
import usersRoutes from './src/routes/users.js';
import connectionsRoutes from './src/routes/connections.js';
import exchangesRoutes from './src/routes/exchanges.js';
import aiRoutes from './src/routes/ai.js'; // ✅ NEW

import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();

// ================= DATABASE =================
connectDB();

// ================= MIDDLEWARE =================
app.use(helmet());

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/exchanges', exchangesRoutes);

// 🤖 AI ROUTE (clean)
app.use('/api/ai', aiRoutes);

// ================= HEALTH =================
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// ================= 404 =================
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ================= ERROR =================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});