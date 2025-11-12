import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const dbUrl = process.env.DB_URL as string;

        if (!dbUrl) {
            throw new Error('DB_URL is not defined in .env');
        }

        await mongoose.connect(dbUrl, {});

        console.log('✅ MongoDB connected successfully');
    } catch (error: any) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;
