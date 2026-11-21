import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_mern';
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri);
    } catch (err) {
      console.warn('MongoDB connection failed in test setup:', err);
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

