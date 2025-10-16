import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { projectIdSchema } from "../validation/project.validation";
import { createTaskSchema, dueDate, taskIdSchema, updateTaskSchema } from "../validation/task.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.services";
import { UnauthorizedException } from "../utilities/appError";
import { roleGuard } from "../utilities/roleGuard";
import { PermissionType } from "../generated/prisma";
import { HTTPSTATUS } from "../config/https.config";
import { createTaskService, deleteTaskService, getAllTasksService, getTaskByIdService, updateTaskService } from "../services/task.services";
import { rolePremission } from "../utilities/role-permission";

export const createTaskController = asyncHandler(async (req: Request, res: Response) => {
    const projectId = projectIdSchema.parse(req.params.projectId)
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)

    const userId = req.user?.id
    if (!userId) {
        throw new UnauthorizedException("Unauthorized PLease login")
    }

    const body = createTaskSchema.parse(req.body)

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.CREATE_TASK])

    const { task } = await createTaskService(
        workspaceId,
        projectId,
        userId,
        body
    )

    return res.status(HTTPSTATUS.OK).json({
        message: "Task created successfully",
        task
    })

})

export const updateTaskController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id
    if (!userId) {
        throw new UnauthorizedException("Unauthorized PLease login")
    }
    const body = updateTaskSchema.parse(req.body)

    const taskId = taskIdSchema.parse(req.params.id)
    const projectId = projectIdSchema.parse(req.params.projectId)
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.EDIT_TASK])

    const { updatedTask } = await updateTaskService(
        workspaceId,
        projectId,
        taskId,
        body
    )

    return res.status(HTTPSTATUS.OK).json({
        message: "Task updated successfully",
        updatedTask
    })

})

export const deleteTaskController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id
    if (!userId) {
        throw new UnauthorizedException("Unauthorized PLease login")
    }
    const taskId = taskIdSchema.parse(req.params.id)
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.DELETE_TASK])

    await deleteTaskService(workspaceId, taskId)

    return res.status(HTTPSTATUS.OK).json({
        message: "Task deleted successfully"
    })
})

export const getAllTasksController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
    const userId = req.user?.id
    if (!userId) {
        throw new UnauthorizedException("Unauthorized PLease login")
    }
    const filter = {
        projectId: req.query.projectId ? String(req.query.projectId) : undefined,
        status: req.query.status ? String(req.query.status).split(',') : undefined,
        priority: req.query.priority ? String(req.query.priority).split(',') : undefined,
        assignedTo: req.query.assignedTo ? String(req.query.assignedTo).split(',') : undefined,
        dueDate: req.query.dueDate ? String(req.query.dueDate) : undefined,
        keyword: req.query.keyword ? String(req.query.keyword) : undefined,
    }
    const pagination = {
        pageSize: parseInt(req.query.pageSize as string) || 10,
        pageNumber: parseInt(req.query.pageNumber as string) || 1
    }
    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.VIEW_ONLY])

    const result = await getAllTasksService(workspaceId, filter, pagination)

    return res.status(HTTPSTATUS.OK).json({
        message: "Tasks fetched successfully",
        ...result
    })
})

export const getTaskByIdController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id
    if (!userId) {
        throw new UnauthorizedException("Unauthorized PLease login")
    }
    const taskId = taskIdSchema.parse(req.params.id)
    const projectId = projectIdSchema.parse(req.params.projectId)
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId)
    roleGuard(role, [PermissionType.VIEW_ONLY])

    const task = await getTaskByIdService(workspaceId, taskId, projectId)

    return res.status(HTTPSTATUS.OK).json({
        message: "Task fetched successfully",
        task
    })

})