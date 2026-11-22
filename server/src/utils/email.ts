import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { ApiError } from './ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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
  const resetLink = escapeHtml(resetUrl.toString());

  await transporter.sendMail({
    from,
    to: email,
    subject: 'Reset your BlogMERN password',
    text: `Use this link to reset your password. It expires in one hour:\n\n${resetUrl.toString()}\n\nIf you did not request a password reset, you can ignore this email.`,
    html: `
      <div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:Arial,sans-serif;color:#1f2937;line-height:1.6;">
        <h1 style="margin:0 0 16px;color:#312e81;font-size:24px;">Reset your BlogMERN password</h1>
        <p style="margin:0 0 24px;">Click the button below to choose a new password. This link expires in one hour.</p>
        <p style="margin:0 0 24px;">
          <a href="${resetLink}" style="display:inline-block;padding:12px 22px;border-radius:8px;background-color:#4f46e5;color:#ffffff;text-decoration:none;font-weight:bold;">Reset password</a>
        </p>
        <p style="margin:0 0 8px;font-size:14px;">If the button doesn't work, open this link:</p>
        <p style="margin:0 0 24px;overflow-wrap:anywhere;font-size:14px;">
          <a href="${resetLink}" style="color:#2563eb;text-decoration:underline;">${resetLink}</a>
        </p>
        <p style="margin:0;color:#6b7280;font-size:13px;">If you did not request a password reset, you can ignore this email.</p>
      </div>
    `,
  });
};
