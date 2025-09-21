import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { fetchCurrentUser } from "../services/user.services";
import { HTTPSTATUS } from "../config/https.config";

export const getCurrentUserController= asyncHandler(async(req:Request,res:Response)=>{
    const userId = req.user?.id
    if(!userId){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const {user}=await fetchCurrentUser(userId)
    res.status(HTTPSTATUS.OK).json({
        message:"User fetched successfully",
        user
    })
})
