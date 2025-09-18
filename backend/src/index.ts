import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, urlencoded } from 'express'
import { asyncHandler } from './middleware/asyncHandler.middleware'
import { errorHandler } from './middleware/errorHandler.middleware'
import { config } from './config/app.config'
import session from 'cookie-session'
import cors from 'cors'
import { HTTPSTATUS } from './config/https.config'
import authRoute from './routes/auth.routes'
import { BadRequestException } from './utilities/appError'

const app =express()

const PORT=config.PORT || 5000
const  BASE_PATH=config.BASE_PATH


app.use(express.json())
app.use(urlencoded({extended:true}))

app.use(session({
    name:"session",
    keys:[config.SESSION_SECRET],
    maxAge:24*60*60*100,
    secure:config.MODE_ENV==="PRODUCTION",
    httpOnly:true,
    sameSite:false 
}))

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

app.use(errorHandler)

app.listen(PORT,()=>console.log(`Server running at PORT ${PORT}`))
