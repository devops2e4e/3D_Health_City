import mongoose from 'mongoose';
import config from './index';

export const connectDatabase = async (): Promise<void> => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsecity';
        await mongoose.connect(uri, { dbName: 'pulsecity' });
        console.log('✅ MongoDB connected successfully');

        // Enable geospatial indexing
        mongoose.set('debug', config.env === 'development');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
