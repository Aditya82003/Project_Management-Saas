import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { UnauthorizedException } from "../utilities/appError";
import { getMemberRoleInWorkspaceService } from "../services/member.services";
import { roleGuard } from "../utilities/roleGuard";
import { PermissionType } from "../generated/prisma";
import { HTTPSTATUS } from "../config/https.config";
import { createProjectService, deleteProjectService, getProjectAnalyticsService, getProjectByIdService, getProjectsInWorkspaceService, updateProjectService } from "../services/project.services";
import { createProjectSchema, projectIdSchema, updateProjectSchema } from "../validation/project.validation";

export const createProjectController = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body)
    const body = createProjectSchema.parse(req.body)
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
    const userId = req.user?.id
    if (!userId) {
        throw new UnauthorizedException("Unauthorized PLease login")
    }

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.CREATE_PROJECT])

    const { project } = await createProjectService(userId,workspaceId, body)

    return res.status(HTTPSTATUS.OK).json({
        message: "Project created successfully",
        project
    })

})

export const updateProjectController = asyncHandler(async (req: Request, res: Response) => {
    const body= updateProjectSchema.parse(req.body)
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId) 
    const userId = req.user?.id
    const projectId=projectIdSchema.parse(req.params.id)
    if(!userId){
        throw new UnauthorizedException("Unauthorized PLease login")
    }

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.EDIT_PROJECT])

    const { project } = await updateProjectService(workspaceId,projectId,body)

    return res.status(HTTPSTATUS.OK).json({
        message: "Project updated successfully",
        project
    })
})

export const deleteProjectController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId) 
    const userId = req.user?.id
    const projectId=projectIdSchema.parse(req.params.id)
    if(!userId){
        throw new UnauthorizedException("Unauthorized PLease login")
    }

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.DELETE_PROJECT])    

    await deleteProjectService(workspaceId,projectId)

    return res.status(HTTPSTATUS.OK).json({
        message: "Project deleted successfully"
    })
})

export const getAllProjectsInWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
    const userId = req.user?.id
    if (!userId) {
        throw new UnauthorizedException("Unauthorized PLease login")
    }

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.VIEW_ONLY])

    const pageSize = parseInt(req.query.page as string) || 10
    const pageNumber = parseInt(req.query.limit as string) || 1


    const { projects,totalCount,totalPages,skip } = await getProjectsInWorkspaceService(workspaceId,pageSize,pageNumber)    


    return res.status(HTTPSTATUS.OK).json({
        message: "Projects fetched successfully",
        projects,
        pagination:{
            totalCount,
            totalPages,
            pageSize,
            pageNumber,
            limit:pageSize,
            skip
        }
    })
})

export const getProjectByIdController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId) 
    const userId = req.user?.id
    const projectId=projectIdSchema.parse(req.params.id)
    if(!userId){
        throw new UnauthorizedException("Unauthorized PLease login")
    }

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)    
    roleGuard(role, [PermissionType.VIEW_ONLY])    

    const project = await getProjectByIdService(projectId,workspaceId)    

    return res.status(HTTPSTATUS.OK).json({
        message: "Project fetched successfully",
        project
    })
})

export const getProjectAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
    const projectId = projectIdSchema.parse(req.params.id)
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
    const userId = req.user?.id
    if (!userId) {
        throw new UnauthorizedException("Unauthorized PLease login")
    }

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.VIEW_ONLY])

    const {analytics}=await getProjectAnalyticsService(workspaceId,projectId)

    return res.status(HTTPSTATUS.OK).json({
        message: "Project analytics fetched successfully",
        analytics
    })
})