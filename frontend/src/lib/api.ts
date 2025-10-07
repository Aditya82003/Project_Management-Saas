import type { AllProjectPayloadType, AllProjectResponseType, AllWorkspaceResponseType, AnalyticsResponseType, CreateProjectPayloadType, CurrentUserResponseType, LoginResponseType, LoginType, ProjectResponseType, RegisterType, UserType, WorkspaceByIdResponseType } from "@/types/api.types";
import API from "./axios-client";

export const loginMutationFn = async (data: LoginType): Promise<LoginResponseType> => {
    const response = await API.post('/auth/login', data)
    return response.data
}

export const registerMutationFn = async (data: RegisterType): Promise<UserType> => {
    const response = await API.post('/auth/register', data)
    return response.data
}

export const logOutMutationFn = async () => {
    await API.post('/auth/logout')
}

export const getCurrentUserQueryFn = async (): Promise<CurrentUserResponseType> => {
    const response = await API.get('/user/current')
    return response.data
}

//******************Workspace*******************

export const createWorkspaceMutationFn = async (data: { name: string }): Promise<UserType> => {
    const response = await API.post('/workspace/create', data)
    return response.data
}

export const getAllWorkspacesUserIsMemberQueryFn = async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get('/workspace/all')
    return response.data
}

export const getWorkspaceAnalyticsQueryFn = async (workspaceId: string): Promise<AnalyticsResponseType> => {
    const response = await API.get(`/workspace/analytics/${workspaceId}`)
    return response.data
}

export const getWorkspaceByIdQueryFn = async (workspaceId: string): Promise<WorkspaceByIdResponseType> => {
    const response = await API.get(`/workspace/${workspaceId}`)
    return response.data
}

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async (
    iniviteCode: string
): Promise<{
    message: string;
    workspaceId: string;
}> => {
    const response = await API.post(`/member/workspace/${iniviteCode}/join`);
    return response.data;
};


//****************project */


export const createProjectMutationFn = async ({ workspaceId, data }: CreateProjectPayloadType): Promise<ProjectResponseType> => {
    const response = await API.post(`/project/workspace/${workspaceId}/create`, data)
    return response.data
}

export const getProjectsInWorkspaceQueryFn = async ({
    workspaceId,
    pageSize = 10,
    pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
    const response = await API.get(`/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`)
    return response.data
}