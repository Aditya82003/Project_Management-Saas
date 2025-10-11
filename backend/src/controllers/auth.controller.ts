import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerUserService } from "../services/auth.services";
import { HTTPSTATUS } from "../config/https.config";
import passport from "passport";

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspaceId
    if (!currentWorkspace) {
        return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/create`)
    };
    return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`)
});

export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body
    await registerUserService(body)

    return res.status(HTTPSTATUS.CREATED).json({
        message: "User created successfully"
    })
})

export const loginController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local',
        (
            err: Error | null,
            user: Express.User | null,
            info: { message: string } | undefined
        ) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                    message: info?.message || "Invalid email or password"
                })
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err)
                }
                return res.status(HTTPSTATUS.CREATED).json({
                    message: "User logged in successfully"
                })
            })
        }
    )(req, res, next)
})

export const logOutController = asyncHandler(async (req: Request, res: Response) => {
    req.logOut((err) => {
        if (err) {
            console.log("Logout error", err)
            return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
                error: "Failed to log out"
            })
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destroy error:", err);
                return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
                    error: "Failed to destroy session",
                });
            }
        })
        res.clearCookie("session")

        return res.status(HTTPSTATUS.OK).json({
            message: "Logged out successfully"
        })
    }) 
}) 