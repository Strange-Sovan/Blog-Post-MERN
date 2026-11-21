import { PostModel } from '../models/Post.model';
import { IPost } from '../interfaces/IPost';
import { IPaginationMeta } from '../interfaces/IApiResponse';
import { generateSlug } from '../utils/slugify';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { Role } from '../constants/roles';
import { IUserPayload } from '../interfaces/IUser';

export interface PostsResult {
  posts: IPost[];
  meta: IPaginationMeta;
}

export const createPost = async (
  title: string,
  content: string,
  authorId: string,
  thumbnailUrl = ''
): Promise<IPost> => {
  const slug = await generateSlug(title);
  const post = await PostModel.create({ title, content, thumbnailUrl, slug, author: authorId });
  return post.populate('author', 'name email');
};

export const getPosts = async (
  page: number,
  limit: number
): Promise<PostsResult> => {
  const skip = (page - 1) * limit;
  const filter = { isDeleted: false };

  const [posts, totalDocs] = await Promise.all([
    PostModel.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    PostModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);
  return {
    posts,
    meta: {
      page,
      limit,
      totalDocs,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getPostBySlug = async (slug: string): Promise<IPost> => {
  const post = await PostModel.findOne({ slug, isDeleted: false }).populate(
    'author',
    'name email'
  );
  if (!post) throw new ApiError(HttpStatus.NOT_FOUND, Messages.POST_NOT_FOUND);
  return post;
};

export const updatePost = async (
  postId: string,
  updates: { title?: string; content?: string; thumbnailUrl?: string },
  user: IUserPayload
): Promise<IPost> => {
  const post = await PostModel.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new ApiError(HttpStatus.NOT_FOUND, Messages.POST_NOT_FOUND);

  if (user.role !== Role.ADMIN && post.author.toString() !== user._id) {
    throw new ApiError(HttpStatus.FORBIDDEN, Messages.POST_FORBIDDEN);
  }

  if (updates.title && updates.title !== post.title) {
    const slug = await generateSlug(updates.title);
    post.title = updates.title;
    post.slug = slug;
  }

  if (updates.content) {
    post.content = updates.content;
  }
  if (updates.thumbnailUrl !== undefined) {
    post.thumbnailUrl = updates.thumbnailUrl;
  }

  await post.save();
  return post.populate('author', 'name email');
};

export const deletePost = async (postId: string, user: IUserPayload): Promise<void> => {
  const post = await PostModel.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new ApiError(HttpStatus.NOT_FOUND, Messages.POST_NOT_FOUND);

  if (user.role !== Role.ADMIN && post.author.toString() !== user._id) {
    throw new ApiError(HttpStatus.FORBIDDEN, Messages.POST_FORBIDDEN);
  }

  post.isDeleted = true;
  post.deletedAt = new Date();
  await post.save();
};
