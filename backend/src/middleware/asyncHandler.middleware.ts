import { NextFunction, Request, Response } from "express"

type AsyncHandlerState = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>
export const asyncHandler = (fn: AsyncHandlerState) => {   
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}


// export const asyncHandler = (fn: AsyncHandlerState) => {
//     return async(req:Request,res:Response,next:NextFunction)=>{
//         try {
//             return await fn(req,res,next) 
//         } catch (error) {
//             next(error)  
//         }

//     }
// }

