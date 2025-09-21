import passport from 'passport'
import { Request } from 'express';
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as LocalStrategy } from 'passport-local'

import { config } from './app.config';
import { NotFoundException } from '../utilities/appError';
import { loginOrCreateAccouunt, verifyUserService } from '../services/auth.services';
import { Provider } from '../generated/prisma';
import { IUser } from '../@types/type';
import prisma from '../prisma/cilent.prisma';

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
    passReqToCallback: true
},
    async (req: Request, accessToken, refreshToken, profile, done:(err:any,user?:IUser|false)=>void) => {
        try {
            const { email, sub: googleId, picture } = profile._json
            console.log(profile, "profile")
            console.log(googleId, "googleId")
            if (!googleId) {
                throw new NotFoundException("Google ID (sub) is missing")
            }
            const { user } = await loginOrCreateAccouunt({
                provider: Provider.GOOGLE,
                providerId: googleId,
                displayName: profile.displayName,
                picture,
                email
            })
            const typedUser: IUser = { ...user, omitPassword: () => ({ ...user, password: undefined }) }
            return done(null, typedUser)
        } catch (error) {
            return done(error, false)
        }
    }
));

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        session: true
    }, async (email, password, done:(err:any, user?:IUser|false)=>void) => {
        try {
            const user = await verifyUserService({ email, password, provider: Provider.EMAIL })
            const typedUser: IUser = { ...user, omitPassword: () => ({ ...user, password: undefined }) }
            return done(null, typedUser)
        } catch (error: any) {
            return done(error, false)

        }
    })
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id: string, done) => {
  try {
   const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return done(null, false);
    const typedUser: IUser = { ...user, omitPassword: () => ({ ...user, password: undefined }) };
    done(null, typedUser as IUser);
  } catch (err) {
    done(err as any, null);
  }
});
