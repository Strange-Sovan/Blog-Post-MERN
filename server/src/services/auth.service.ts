import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { UserModel } from '../models/User.model';
import { IUser, IUserPayload } from '../interfaces/IUser';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { Role } from '../constants/roles';
import logger from '../utils/logger';
import { assertEmailConfigured, sendPasswordResetEmail } from '../utils/email';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: IUserPayload;
}

const buildPayload = (user: IUser): IUserPayload => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthTokens> => {
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new ApiError(HttpStatus.CONFLICT, Messages.AUTH_EMAIL_EXISTS);
  }

  const user = await UserModel.create({ name, email, password, provider: 'local', role: Role.USER });
  logger.info(`New user registered: ${email}`);

  const payload = buildPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return { accessToken, refreshToken, user: payload };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthTokens> => {
  const normalizedEmail = email ? email.trim().toLowerCase() : '';
  const user = await UserModel.findOne({ email: normalizedEmail, provider: 'local' }).select('+password +refreshToken');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, Messages.AUTH_INVALID_CREDENTIALS);
  }

  const payload = buildPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  logger.info(`User logged in: ${email}`);
  return { accessToken, refreshToken, user: payload };
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  assertEmailConfigured();
  const normalizedEmail = email.trim().toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail, provider: 'local' });
  if (!user) return;

  const token = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  user.passwordResetToken = tokenHash;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  try {
    await sendPasswordResetEmail(user.email, token);
  } catch (error) {
    await UserModel.updateOne(
      { _id: user._id, passwordResetToken: tokenHash },
      { $unset: { passwordResetToken: 1, passwordResetExpires: 1 } },
    );
    throw error;
  }
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await UserModel.updateOne(
    { passwordResetToken: tokenHash, passwordResetExpires: { $gt: new Date() } },
    {
      $set: { password: hashedPassword },
      $unset: { passwordResetToken: 1, passwordResetExpires: 1, refreshToken: 1 },
    },
  );
  if (result.modifiedCount !== 1) {
    throw new ApiError(HttpStatus.BAD_REQUEST, Messages.AUTH_PASSWORD_RESET_INVALID);
  }
};

export const refreshUserToken = async (token: string): Promise<AuthTokens> => {
  let payload: IUserPayload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new ApiError(HttpStatus.UNAUTHORIZED, Messages.AUTH_TOKEN_EXPIRED);
  }

  const user = await UserModel.findById(payload._id).select('+refreshToken');
  if (!user || !user.refreshToken) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, Messages.AUTH_TOKEN_INVALID);
  }

  const isValid = await bcrypt.compare(token, user.refreshToken);
  if (!isValid) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, Messages.AUTH_TOKEN_INVALID);
  }

  const newPayload = buildPayload(user);
  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: newPayload };
};

export const logoutUser = async (userId: string): Promise<void> => {
  await UserModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  logger.info(`User logged out: ${userId}`);
};

export const oauthLogin = async (user: IUser): Promise<AuthTokens> => {
  const payload = buildPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return { accessToken, refreshToken, user: payload };
};

