// src/server.ts

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeCosmosDB, closeCosmosDB } from './config/cosmos';
import routes from './routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Middleware
 */

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Request logging middleware (development only)
 */
if (NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

/**
 * API Routes
 */
app.use('/api', routes);

/**
 * Root endpoint
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Full-Stack Web Application API',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      health: '/api/health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        getCurrentUser: 'GET /api/auth/me',
      },
      items: {
        create: 'POST /api/items',
        getAll: 'GET /api/items',
        getById: 'GET /api/items/:id',
        getByStatus: 'GET /api/items/status/:status',
        getOverdue: 'GET /api/items/overdue',
        update: 'PUT /api/items/:id',
        delete: 'DELETE /api/items/:id',
      },
    },
  });
});

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

/**
 * Error handling middleware
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

/**
 * Server initialization
 */
async function startServer(): Promise<void> {
  try {
    // Initialize Cosmos DB connection
    await initializeCosmosDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     Full-Stack Web Application API      ║
╠════════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(30)} │
║ Port: ${String(PORT).padEnd(36)} │
║ CORS Origin: ${corsOrigin.padEnd(30)} │
╚════════════════════════════════════════╝
      `);
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM signal received: closing HTTP server');
  await closeCosmosDB();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT signal received: closing HTTP server');
  await closeCosmosDB();
  process.exit(0);
});

// Start the server
startServer();
