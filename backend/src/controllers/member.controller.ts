import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import z from "zod";
import { HTTPSTATUS } from "../config/https.config";
import { joinWorkspaceByInviteService } from "../services/member.services";

export const joinWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const inviteCode=z.string().parse(req.params.inviteCode)
    const userId = req.user?.id
    if (!userId) {
        throw new Error("Unauthorized PLease login")
    }
    const { workspaceId,role } = await joinWorkspaceByInviteService(inviteCode, userId)

    res.status(HTTPSTATUS.OK).json({
        message: "Workspace joined successfully",
        workspaceId,
        role
    })
})