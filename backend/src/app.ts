import express, { Request, Response } from 'express'
import { asyncHandler } from './middleware/asyncHandler.middleware'
import { errorHandler } from './middleware/errorHandler.middleware'

const PORT=process.env.PORT || 5000

const app =express()
app.use(express.json())

app.get('/',asyncHandler(async(req:Request,res:Response)=>{
    res.status(200).json({
        message:"Response from /"
    })
}))
app.use(errorHandler)

app.listen(PORT,()=>console.log(`Server running at PORT ${PORT}`))
