import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/https.config";
import { changeMemberRoleService, createWorkspaceService, deleteWorkspaceService, getAllWorkspacesUserIsMemberService, updateWorkspaceByIdService } from "../services/workspace.services";
import { createWorkspaceSchema, updateWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.services";
import { UnauthorizedException } from "../utilities/appError";
import { roleGuard } from "../utilities/roleGuard";
import { PermissionType } from "../generated/prisma";

export const createWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body)
    const userId = req.user?.id
    if (!userId) {
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: "Unauthorized PLease login"
        })
    }
    const { workspace } = await createWorkspaceService(body, userId)

    return res.status(HTTPSTATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace
    })
})

export const getAllWorkspacesUserIsMemberController=asyncHandler(async(req:Request,res:Response)=>{
    const userId=req.user?.id
    if(!userId){
        throw new UnauthorizedException("Unauthorized PLease login")    
    }
    const {workspaces}=await getAllWorkspacesUserIsMemberService(userId)

    return res.status(HTTPSTATUS.OK).json({
        message:"Workspaces fetched successfully",
        workspaces
    })
})

export const updateWorkspaceByIdController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id)
    const { name, description } = updateWorkspaceSchema.parse(req.body)

    const userId = req.user?.id
    if(!userId){
        throw new UnauthorizedException("Unauthorized PLease login")
    }
    const {role}=await getMemberRoleInWorkspaceService(userId,workspaceId)
    roleGuard(role,[PermissionType.EDIT_WORKSPACE])
    const { workspace } = await updateWorkspaceByIdService(
        workspaceId,
        name,
        description
    )

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace updated successfully",
        workspace
    })
})

export const changeWorkspaceMemberRoleController=asyncHandler(async(req:Request,res:Response)=>{
    const workspaceId=workspaceIdSchema.parse(req.params.id)
    const {roleId,memberId}=req.body
    const userId=req.user?.id
    if(!userId){
        throw new UnauthorizedException("Unauthorized PLease login")
    }
    const {role}= await getMemberRoleInWorkspaceService(userId,workspaceId)
    roleGuard(role,[PermissionType.CHANGE_MEMBER_ROLE])

    const {member}=await changeMemberRoleService(
        workspaceId,
        memberId,
        roleId
    )

    return res.status(HTTPSTATUS.OK).json({
        message:"Member role changed successfully",
        member
    })
})

export const deleteWorkspaceByIdController=asyncHandler(async(req:Request,res:Response)=>{
    const workspaceId=workspaceIdSchema.parse(req.params.id)
    const userId=req.user?.id
    if(!userId){
        throw new UnauthorizedException("Unauthorized PLease login")
    }
    const {role}=await getMemberRoleInWorkspaceService(userId,workspaceId)
    roleGuard(role,[PermissionType.DELETE_WORKSPACE])

    const {currentWorkspace}=await deleteWorkspaceService(
        workspaceId,
        userId
    )

    res.status(HTTPSTATUS.OK).json({
        message:"Workspace deleted successfully",
        currentWorkspace
    }) 
})

export const getWorkspaceMembersController=asyncHandler(async(req:Request,res:Response)=>{
    
})

export const getWorkspaceAnalyticsController=asyncHandler(async(req:Request,res:Response)=>{
    
})

export const getWorkpsaceByIdController=asyncHandler(async(req:Request,res:Response)=>{
    
})