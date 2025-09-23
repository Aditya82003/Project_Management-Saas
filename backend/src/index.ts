import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, urlencoded } from 'express'
import cors from 'cors'
// import session from 'cookie-session'
import session from 'express-session'
import { config } from './config/app.config'
import { errorHandler } from './middleware/errorHandler.middleware'
import { HTTPSTATUS } from './config/https.config'
import { asyncHandler } from './middleware/asyncHandler.middleware'
import authRoute from './routes/auth.routes'
import userRoute from './routes/user.routes'
import workspaceRoute from './routes/workspace.routes'
import memberRoute from './routes/member.routes'
import { BadRequestException } from './utilities/appError'
import passport from 'passport'
import "./config/passport.config"
import isAuthenticated from './middleware/isAuthenticate.middleware'

const app =express()

const PORT=config.PORT || 5000
const  BASE_PATH=config.BASE_PATH

//parse json data and added them into req.body
app.use(express.json())
app.use(urlencoded({extended:true}))

//session for passport
// app.use(session({
//     name:"session",
//     keys:[config.SESSION_SECRET],
//     maxAge:24*60*60*100,
//     secure:config.MODE_ENV==="PRODUCTION",
//     httpOnly:true,
//     sameSite:"lax" 
// }))
app.use(
  session({
    name: "session",
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: config.MODE_ENV === "PRODUCTION", // true in prod with HTTPS
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//allow cross origin request
app.use(cors({
    origin:config.FRONTEND_ORIGIN,
    credentials:true
}))


app.get('/',asyncHandler(async(req:Request,res:Response)=>{
    throw new BadRequestException("Bad request")
    res.status(HTTPSTATUS.OK).json({
        message:"Response from /"
    })
}))

app.use(`${BASE_PATH}/auth`,authRoute)
app.use(`${BASE_PATH}/user`,isAuthenticated,userRoute)
app.use(`${BASE_PATH}/workspace`,isAuthenticated,workspaceRoute)
app.use(`${BASE_PATH}/member`,isAuthenticated,memberRoute)
// app.use(`${BASE_PATH}/task`,isAuthenticated,taskRoute)
// app.use(`${BASE_PATH}/project`,isAuthenticated,projectRoute)

//global middleware
app.use(errorHandler)

app.listen(PORT,()=>console.log(`Server running at PORT ${PORT}`))
