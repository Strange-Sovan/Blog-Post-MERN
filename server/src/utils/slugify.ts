import slugifyLib from 'slugify';
import { PostModel } from '../models/Post.model';

export const generateSlug = async (title: string): Promise<string> => {
  let slug = slugifyLib(title, { lower: true, strict: true, trim: true });
  const existing = await PostModel.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }
  return slug;
};

