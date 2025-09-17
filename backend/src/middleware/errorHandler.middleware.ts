import { NextFunction, Request, Response } from "express";

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler=(err:ApiError,req:Request,res:Response,next:NextFunction)=>{
    console.log("<------------------Error---------->")
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        success:false,
        message:err.message||"Server Error" ,
        stack: process.env.MODE_ENV ==="production"? undefined :err.stack
    })
}