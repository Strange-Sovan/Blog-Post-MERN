import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../models/User.model';
import { PostModel } from '../models/Post.model';
import { CommentModel } from '../models/Comment.model';
import { Role } from '../constants/roles';
import { generateSlug } from '../utils/slugify';
import logger from '../utils/logger';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_mern';

export const seedDatabase = async (): Promise<void> => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@blogmern.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    logger.info('Connecting to MongoDB for database seeding...');
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB successfully.');

    // 1. Check or create Admin user
    let admin = await UserModel.findOne({ email: adminEmail });

    if (!admin) {
      admin = await UserModel.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: Role.ADMIN,
        provider: 'local',
      });
      logger.info(`✅ Admin user seeded: ${adminEmail} (Role: ${Role.ADMIN})`);
    } else {
      admin.role = Role.ADMIN;
      await admin.save();
      logger.info(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    // 3. Seed sample blog posts if post count is low
    const existingPostsCount = await PostModel.countDocuments({ isDeleted: false });
    if (existingPostsCount === 0) {
      logger.info('Seeding initial sample posts...');

      const samplePosts = [
        {
          title: 'Getting Started with MERN Stack in 2026',
          content: `The MERN stack (MongoDB, Express.js, React, Node.js) remains one of the most popular and versatile technology combinations for building scalable full-stack web applications.
          
In this comprehensive guide, we explore modern TypeScript patterns, cookie-based session handling, React 19 capabilities, and enterprise-grade architecture.`,
          author: admin._id,
        },
        {
          title: 'Why HTTP-Only Cookies Beat LocalStorage for Auth',
          content: `Storing authentication tokens in browser localStorage leaves your application vulnerable to Cross-Site Scripting (XSS) attacks. Any rogue script injected into the client can extract sensitive JWT credentials.

By contrast, using httpOnly, Secure, SameSite=Strict cookies ensures the browser transmits credentials automatically while completely shielding them from JavaScript access.`,
          author: admin._id,
        },
        {
          title: 'Mastering React 19 and TanStack Query v5',
          content: `React 19 brings exciting advancements to server-side capabilities, component rendering, and hook optimizations. Pairing it with TanStack Query v5 gives you instantaneous cache synchronization, optimistic mutations, and effortless pagination.`,
          author: admin._id,
        },
      ];

      for (const p of samplePosts) {
        const slug = await generateSlug(p.title);
        const createdPost = await PostModel.create({
          title: p.title,
          content: p.content,
          slug,
          author: p.author,
          isDeleted: false,
        });

        // Add sample comments to each post
        await CommentModel.create({
          content: `Great article! Really enjoyed reading through these production best practices.`,
          author: admin._id,
          post: createdPost._id,
        });
      }

      logger.info(`✅ Seeded ${samplePosts.length} sample posts with comments.`);
    } else {
      logger.info(`ℹ️ Posts already exist in database (${existingPostsCount} posts). Skipping post seeding.`);
    }

    logger.info('🎉 Database seeding completed successfully!');
  } catch (error) {
    logger.error('Error during database seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB.');
  }
};

// Execute if run directly from CLI
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

