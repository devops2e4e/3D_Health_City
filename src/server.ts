import express, { Application } from 'express';
import cors from 'cors';
import config from './config';
import { connectDatabase } from './config/database';
import routes from './routes';
import { errorHandler, notFound } from './middlewares/errorHandler';

const app: Application = express();

// Middleware
app.use(cors({
    origin: config.allowedOrigins,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (config.env === 'development') {
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();

        // Start listening
        app.listen(config.port, () => {
            console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🏥  PulseCity API Server                           ║
║                                                       ║
║   Environment: ${config.env.padEnd(36)}║
║   Port:        ${config.port.toString().padEnd(36)}║
║   Database:    Connected ✅                          ║
║                                                       ║
║   API:         http://localhost:${config.port}/api           ║
║   Health:      http://localhost:${config.port}/api/health    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
