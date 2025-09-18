import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/https.config";
import { AppError, NotFoundException } from "../utilities/appError";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(`Error Occured on PATH ${req.path}`, error)

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON",
    })
  }
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      message:error.message,
    })
  }

  res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: error.message || "Internal Server Error",
  })
}