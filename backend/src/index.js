import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/index.js';
import weatherRoutes from './routes/weather.js';
import citiesRoutes from './routes/cities.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Startup validation
if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY === 'your_api_key_here') {
  console.error('ERROR: OPENWEATHER_API_KEY is required. Set it in .env (see .env.example)');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is required. In Docker it is set automatically.');
  process.exit(1);
}

async function start() {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    console.error('ERROR: Cannot connect to database. Is PostgreSQL running?', err.message);
    process.exit(1);
  }

  const app = express();

  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'DELETE'],
  }));
  app.use(express.json());

  app.use('/api/weather', weatherRoutes);
  app.use('/api/cities', citiesRoutes);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use((req, res) => {
    res.status(404).json({
      error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
    });
  });

  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
    });
  });

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

start();
