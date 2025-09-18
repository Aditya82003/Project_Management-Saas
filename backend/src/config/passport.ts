import passport from 'passport'
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from './app.config';
import prisma from '../prisma/cilent.prisma';

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const provider = await prisma.accountProvider.findFirst({
                where: {
                    provider: "GOOGLE",
                    providerId: profile.id
                },
                include: { user: true }
            })
            if (provider) {
                return done(null, provider.user)
            }

            let user = await prisma.user.findUnique({
                where: {
                    email: profile.emails?.[0].value
                }
            })

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        name: profile.displayName,
                        email: profile.emails?.[0].value as string,
                        profilePicture: profile.photos?.[0].value,
                        isActive: true,
                        accountProvider: {
                            create: {
                                provider: "GOOGLE",
                                providerId: profile.id
                            }
                        }
                    }
                })
            } else {
                await prisma.accountProvider.create({
                    data: {
                        provider: "GOOGLE",
                        providerId: profile.id,
                        userId: user.id
                    }
                })
            }
            return done(null, user)
        } catch (error) {
            return done(error as Error, undefined)
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.id)
})
passport.deserializeUser(async(id:string,done)=>{
    try{
        const user=await prisma.user.findUnique({
            where:{id}
        })
        done(null,user)
    }catch(error){
        done(error as Error,undefined)
    }
})