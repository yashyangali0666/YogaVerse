import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './prisma';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('🌿 Database connected successfully via Prisma PostgreSQL.');

    const server = app.listen(PORT, () => {
      console.log(`🧘 YogaLife Backend API server running on http://localhost:${PORT}`);
    });

    const gracefulShutdown = async () => {
      console.log('\nGracefully shutting down YogaLife server...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected. Process exiting.');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
