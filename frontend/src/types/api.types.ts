export type LoginType = {
    email: string
    password: string
}
export type LoginResponseType = {
    message: string
    user: {
        id: string;
        currentWorkspaceId: string
    }
}

export type RegisterType = {
    name: string
    email: string
    password: string
}

export type UserType = {
    id: string
    name: string
    email: string
    profilePicture?: string
    isActive: boolean
    lastLogin?: Date
    createdAt: Date
    updatedAt: Date
    currentWorkspace: {
        id: string
        name: string
        owner:string
        inviteCode: string
    }
}

export type CurrentUserResponseType={
    message:string
    user:UserType
}

//*********workspace ************

export type WorkspaceType={
    id:string
    name:string
    description?:string
    inviteCode:string
    owner:string
}

export type CreateWorkpsaceType={
    name:string
    description:string
}

export type EditWorkspaceType={
    workspaceId:string
    data:{
        name:string
        description:string
    }
}

export type CreateWorkspaceResponseType={
    message:string
    workspace:WorkspaceType
}

export type AllWorkspaceResponseType={
    message:string
    workspaces:WorkspaceType[]
}

export type AnalyticsResponseType={
    message:string
    analytics:{
        totalTasks:number,
        overdueTasks:number,
        completedTasks:number
    }
}

export type Pagination ={
    totalCount:number
    pageSize:number
    pageNumber:number
    totalPages:number
    skip:number
    limit:number
}

export type ProjectType={
    id:string
    name:string
    emoji:string
    description:string
    workspace:string
    createdBy:{
        id:string
        name:string
        profilePicture:string
    }
    createdAt:Date
    updatedAt:Date
}

export type AllProjectPayloadType={
    workspaceId:string
    pageNumber?:number
    pageSize?:number
    keyword?:string
    skip?:boolean
}

export type AllProjectResponseType={
    message:string
    projects:ProjectType[]
    pagination:Pagination
}