import express from 'express'
import passport from 'passport'
import { googleLoginCallback } from '../controllers/auth.controller'

const router = express.Router()

router.get('/google',passport.authenticate('google',{scope:["profile","email"]}))
router.get('/google/callback',passport.authenticate('google',{failureRedirect:"/"}),googleLoginCallback)

export default router