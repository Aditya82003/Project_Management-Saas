import express from 'express'
import passport from 'passport'
import { googleLoginCallback, registerUserController } from '../controllers/auth.controller'
import { config } from '../config/app.config'

const router = express.Router()

const failedUrl =`${config.FRONTEND_GOOGLE_CALLBACK_URL}/?status=failure`

router.post('/register',registerUserController)

router.get('/google',passport.authenticate('google',{scope:["profile","email"]}))

router.get('/google/callback',passport.authenticate('google',{failureRedirect:failedUrl}),googleLoginCallback)

export default router