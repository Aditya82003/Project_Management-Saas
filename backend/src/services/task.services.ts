import { ta } from "zod/v4/locales"
import { TaskPriority, TaskStatus } from "../generated/prisma"
import prisma from "../prisma/cilent.prisma"
import { NotFoundException } from "../utilities/appError"

export const createTaskService = async (
    workspaceId: string,
    projectId: string,
    userId: string,
    body: {
        title: string,
        description?: string,
        priority?: TaskPriority,
        status?: TaskStatus,
        assignedToId?: string | null,
        dueDate?: Date
    }
) => {
    const { title, description, priority, status, assignedToId, dueDate } = body

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId
        }
    })
    if (!project || project.workspaceId !== workspaceId) {
        throw new NotFoundException("Project not found")
    }
    const taskCount = await prisma.task.count({
        where: {
            projectId
        }
    })
    const taskCode = `TASK-${taskCount + 1}`

    const task = await prisma.task.create({
        data: {
            taskCode,
            title,
            description,
            priority: priority,
            status: status,
            assignedToId,
            projectId: projectId,
            createdById: userId,
            dueDate: dueDate ?? null,
        }
    })

    return { task }
}

export const updateTaskService = async (
    workspaceId: string,
    projectId: string,
    taskId: string,
    body: {
        title: string,
        description?: string,
        priority?: TaskPriority,
        status?: TaskStatus,
        assignedToId?: string | null,
        dueDate?: Date
    }
) => {
    const { title, description, priority, status, assignedToId, dueDate } = body

    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })
    if (!project || project.workspaceId !== workspaceId) {
        throw new NotFoundException("Project not found")
    }

    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        }
    })
    if (!task || task.projectId !== projectId) {
        throw new NotFoundException("Task not found or does not belong to this project")
    }

    const updatedTask = await prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            title,
            description,
            priority,
            status,
            assignedToId,
            dueDate: dueDate ?? null
        }
    })
    return { updatedTask }
}

export const deleteTaskService = async (workspaceId: string, taskId: string) => {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            project: {
                workspaceId
            }
        },
        select: {
            id: true
        }
    })
    if (!task) {
        throw new NotFoundException("Task not found")
    }

    await prisma.task.delete({
        where: {
            id: taskId
        }
    })
}

export const getAllTasksService = async (
    workspaceId: string,
    filter: {
        projectId?: string,
        status?: string[],
        priority?: string[],
        assignedto?: string[],
        dueDate?: string,
        keyword?: string
    },
    pagination: {
        pageSize: number,
        pageNumber: number
    }
) => {
    const where: any = {
        project: {
            workspaceId
        }
    }
    if (filter.projectId) {
        where.projectId = filter.projectId
    }
    if (filter.status) {
        where.status = { in: filter.status }
    }
    if (filter.priority) {
        where.priority = { in: filter.priority }
    }
    if (filter.assignedto) {
        where.assignedToId = { in: filter.assignedto }
    }
    if (filter.dueDate) {
        where.dueDate = new Date(filter.dueDate)
    }
    if (filter.keyword) {
        where.OR = [
            { title: { contains: where.keyword, mode: "insensitive" } },
            { description: { contains: where.keyword, mode: "insensitive" } },
        ];
    }
    const { pageNumber, pageSize } = pagination
    const skip = (pageNumber - 1) * pageSize

    const [tasks, totalcount] = await prisma.$transaction([
        prisma.task.findMany({
            where,
            skip,
            take: pageSize,
            include: {
                project: {
                    select:{
                        id: true,
                        name: true,
                    }
                },
                assignedTo: {
                    select:{
                        id: true,
                        name: true,
                        profilePicture: true,
                    }
                },
            }
        }),
        prisma.task.count({
            where
        })
    ])
    const totalPage = Math.ceil(totalcount / pageSize)

    return {
        tasks,
        pagination:{
            pageSize,
            pageNumber,
            totalcount,
            totalPage,
            skip
        }
    }
}

export const getTaskByIdService = async (
    workspaceId: string,
    projectId: string,
    taskId: string
) => {
    const project = await prisma.project.findUnique({
        where:{id:projectId},
    })
    if(!project || project.workspaceId !== workspaceId){
        throw new NotFoundException("Project not found")
    }
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            projectId,
            project: {
                workspaceId
            }
        },
        include:{
            assignedTo:{
                select:{
                    id: true,
                    name: true,
                    profilePicture: true
                }
            }
        }
    })
    if (!task) {
        throw new NotFoundException("Task not found")
    }
    return  task 
}