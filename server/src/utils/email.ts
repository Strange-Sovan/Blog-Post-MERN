import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { ApiError } from './ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';

export const assertEmailConfigured = (): void => {
  const from = env.SMTP_FROM || env.SMTP_USER;
  if (!env.SMTP_HOST || !from || Boolean(env.SMTP_USER) !== Boolean(env.SMTP_PASSWORD)) {
    throw new ApiError(HttpStatus.SERVICE_UNAVAILABLE, Messages.AUTH_EMAIL_NOT_CONFIGURED);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  assertEmailConfigured();
  const from = env.SMTP_FROM || env.SMTP_USER;
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    ...(env.SMTP_USER && { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } }),
  });
  const resetUrl = new URL('/reset-password', env.CLIENT_URL);
  resetUrl.searchParams.set('token', token);

  await transporter.sendMail({
    from,
    to: email,
    subject: 'Reset your BlogMERN password',
    text: `Use this link to reset your password. It expires in one hour:\n\n${resetUrl.toString()}\n\nIf you did not request a password reset, you can ignore this email.`,
  });
};
