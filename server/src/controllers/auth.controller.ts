import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiResponse } from '../utils/ApiResponse';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { IAuthRequest } from '../interfaces/IRequest';
import { IUser } from '../interfaces/IUser';
import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  oauthLogin,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.service';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions,
} from '../utils/cookieOptions';
import { env } from '../config/env';

const setCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie('access_token', accessToken, accessTokenCookieOptions);
  res.cookie('refresh_token', refreshToken, {
    ...refreshTokenCookieOptions,
    path: '/api/v1/auth/refresh',
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { accessToken, refreshToken, user } = await registerUser(name, email, password);
  setCookies(res, accessToken, refreshToken);
  ApiResponse.send(res, HttpStatus.CREATED, Messages.AUTH_REGISTER_SUCCESS, user);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await loginUser(email, password);
  setCookies(res, accessToken, refreshToken);
  ApiResponse.send(res, HttpStatus.OK, Messages.AUTH_LOGIN_SUCCESS, user);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await requestPasswordReset(req.body.email);
  ApiResponse.send(res, HttpStatus.OK, Messages.AUTH_PASSWORD_RESET_REQUESTED);
});

export const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  await resetPassword(req.body.token, req.body.password);
  ApiResponse.send(res, HttpStatus.OK, Messages.AUTH_PASSWORD_RESET_SUCCESS);
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    return ApiResponse.error(res, HttpStatus.UNAUTHORIZED, Messages.AUTH_TOKEN_INVALID);
  }
  const { accessToken, refreshToken, user } = await refreshUserToken(token);
  setCookies(res, accessToken, refreshToken);
  ApiResponse.send(res, HttpStatus.OK, Messages.AUTH_TOKEN_REFRESHED, user);
});

export const logout = catchAsync(async (req: IAuthRequest, res: Response) => {
  if (req.user) {
    await logoutUser(req.user._id);
  }
  res.clearCookie('access_token', clearCookieOptions);
  res.clearCookie('refresh_token', { ...clearCookieOptions, path: '/api/v1/auth/refresh' });
  ApiResponse.send(res, HttpStatus.OK, Messages.AUTH_LOGOUT_SUCCESS);
});

export const getMe = catchAsync(async (req: IAuthRequest, res: Response) => {
  ApiResponse.send(res, HttpStatus.OK, Messages.USER_FETCHED, req.user);
});

export const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as unknown as IUser;
  const { accessToken, refreshToken } = await oauthLogin(user);
  setCookies(res, accessToken, refreshToken);
  res.redirect(`${env.CLIENT_URL}/auth/success`);
});

export const facebookCallback = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as unknown as IUser;
  const { accessToken, refreshToken } = await oauthLogin(user);
  setCookies(res, accessToken, refreshToken);
  res.redirect(`${env.CLIENT_URL}/auth/success`);
});

