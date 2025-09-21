import { NextFunction, Request, Response } from "express"
import { UnauthorizedException } from "../utilities/appError"

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if(!req.user || !req.user.id){
        throw new UnauthorizedException("Unauthorized. PLease log in")
    }
    next()
}
export default isAuthenticated