import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { UserModel } from '../models/User.model';
import { Role } from '../constants/roles';
import { env } from './env';
import logger from '../utils/logger';

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ providerId: profile.id, provider: 'google' });
          if (!user) {
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await UserModel.findOne({ email });
            }
            if (!user) {
              user = await UserModel.create({
                name: profile.displayName,
                email: profile.emails?.[0]?.value || `${profile.id}@google.com`,
                provider: 'google',
                providerId: profile.id,
                role: Role.USER,
              });
            } else {
              user.provider = 'google';
              user.providerId = profile.id;
              await user.save();
            }
          }
          return done(null, user as any);
        } catch (error) {
          logger.error('Google OAuth error:', error);
          return done(error as Error, undefined);
        }
      }
    )
  );
}

if (env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET && env.FACEBOOK_APP_ID !== 'your_facebook_app_id_here') {
  passport.use(
    new FacebookStrategy(
      {
        clientID: env.FACEBOOK_APP_ID,
        clientSecret: env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/v1/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ providerId: profile.id, provider: 'facebook' });
          if (!user) {
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await UserModel.findOne({ email });
            }
            if (!user) {
              user = await UserModel.create({
                name: profile.displayName,
                email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
                provider: 'facebook',
                providerId: profile.id,
                role: Role.USER,
              });
            } else {
              user.provider = 'facebook';
              user.providerId = profile.id;
              await user.save();
            }
          }
          return done(null, user as any);
        } catch (error) {
          logger.error('Facebook OAuth error:', error);
          return done(error as Error, undefined);
        }
      }
    )
  );
}

export default passport;

