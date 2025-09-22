import { use } from "passport"
import prisma from "../prisma/cilent.prisma"
import { BadRequestException, NotFoundException } from "../utilities/appError"
import { generateInviteCode } from "../utilities/generateInviteCode"

export const createWorkspaceService = async (body: { name: string, description?: string | undefined }, userId: string) => {
    const { name, description } = body
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (!user) {
        throw new NotFoundException("User not found")
    }
    const ownerRole = await prisma.role.findUnique({
        where: { role: "OWNER" }
    })
    if (!ownerRole) {
        throw new NotFoundException("Owner role not found")
    }
    const [workspace] = await prisma.$transaction(async (ts) => {
        const workspace = await ts.workspace.create({
            data: {
                name,
                description,
                ownerId: userId,
                inviteCode: generateInviteCode()
            }
        })
        await prisma.member.create({
            data: {
                userId,
                workspaceId: workspace.id,
                roleId: ownerRole.id
            }
        })
        await prisma.user.update({
            where: { id: userId },
            data: { currentWorkspaceId: workspace.id }
        })
        return [workspace]
    })
    return { workspace }
}

export const getWorkspaceByIdService = async (workspaceId: string) => {
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        include: {
            members: {
                include: {
                    role: true
                }
            }
        }
    })
    if (!workspace) {
        throw new NotFoundException("Workspace not found")
    }
    return workspace
}

export const getWorkspaceMemberService = async (workspaceId: string) => {
    const members = await prisma.member.findMany({
        where: { workspaceId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePicture: true,
                }
            }, role: {
                select: {
                    id: true,
                    role: true
                }
            }
        }
    })
    const roles = await prisma.role.findMany({
        select: { id: true, role: true }
    })
    return { members, roles }
}

export const updateWorkspaceByIdService = async (workspaceId: string, name: string, description: string) => {
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId }
    })
    if (!workspace) {
        throw new NotFoundException("Workspace not found")
    }
    const updatedWorkspace = await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
            name: name || workspace.name,
            description: description || workspace.description
        }
    })
    return { workspace: updatedWorkspace }
}

export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
    const workspaces = await prisma.workspace.findMany({
        where: { members: { some: { userId } } },
    })
    return { workspaces }
}

export const changeMemberRoleService = async (workspaceId: string, memberId: string, roleId: string) => {
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId }
    })
    if (!workspace) {
        throw new NotFoundException("Workspace not found")
    }
    const role = await prisma.role.findUnique({
        where: { id: roleId }
    })
    if (!role) {
        throw new NotFoundException("Role not found")
    }
    const member = await prisma.member.findUnique({
        where: { id: memberId }
    })
    if (!member) {
        throw new NotFoundException("Member not found")
    }
    const updatedMember = await prisma.member.update({
        where: { id: memberId },
        data: { roleId }
    })

    return { member: updatedMember }
}

export const deleteWorkspaceService = async (workspaceId: string, userId: string) => {
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId }
    })
    if (!workspace) {
        throw new NotFoundException("Workspace not found")
    }
    if (workspace.ownerId !== userId) {
        throw new BadRequestException("You are not the owner of this workspace")
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (!user) {
        throw new NotFoundException("User not found")
    }
    const {updatedUser} = await prisma.$transaction(async (ts) => {
        //delete all the tasks
        await ts.task.deleteMany({
            where: {
                project: {
                    workspaceId: workspace.id
                }
            }
        })
        //delete all the projects
        await ts.project.deleteMany({
            where: {
                workspaceId: workspace.id
            }
        })
        //delete all the members
        await ts.member.deleteMany({
            where: {
                workspaceId: workspace.id
            }
        })
        if (user.currentWorkspaceId === workspace.id) {
            const memberWorkspace = await ts.member.findFirst({
                where: {
                    userId: user.id
                }
            })
            await ts.user.update({
                where: { id: user.id },
                data: { currentWorkspaceId: memberWorkspace?.workspaceId ?? null },
            })
        }
        //delete the workspace
        await ts.workspace.delete({
            where: { id: workspace.id }
        })

        const updatedUser = await ts.user.findUnique({
            where:{id:user.id},
            include:{
                currentWorkspace:true
            }
        })
        return {updatedUser}
    })
    return { currentWorkspace: updatedUser?.currentWorkspace }
}