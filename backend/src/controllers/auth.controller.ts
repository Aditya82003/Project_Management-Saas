import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { config } from "../config/app.config";

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
    res.json(req.user?.currentWorkspaceId)
    // const currentWorkspace = req.user?.currentWorkspaceId
    // if (!currentWorkspace) {
    //     return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`)
    // };
    // return res.redirect(`${config.FRONTEND_ORIGIN}/${currentWorkspace}`)
});