import type { AllMembersInWorskpaceResponseType, AllProjectPayloadType, AllProjectResponseType, AllTaskPayloadType, AllTaskResponseType, AllWorkspaceResponseType, AnalyticsResponseType, ChangeMemberRoleInWorkspacePayloadType, CreateProjectPayloadType, CreateTaskPayloadType, CreateWorkpsaceType, CreateWorkspaceResponseType, CurrentUserResponseType, DeleteWorkspaceResponseType, EditProjectPayloadType, EditTaskPayloadType, EditWorkspaceType, LoginResponseType, LoginType, ProjectByIdPayloadType, ProjectResponseType, RegisterType, UserType, WorkspaceByIdResponseType } from "@/types/api.types";
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

export const createWorkspaceMutationFn = async (data: CreateWorkpsaceType): Promise<CreateWorkspaceResponseType> => {
    const response = await API.post('/workspace/create/new', data)
    return response.data
}

export const editWorkspaceMutationFn = async ({ workspaceId, data }: EditWorkspaceType): Promise<CreateWorkspaceResponseType> => {
    const response = await API.put(`/workspace/update/${workspaceId}`, data)
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


export const getMembersInWorkspaceQueryFn = async (workspaceId: string): Promise<AllMembersInWorskpaceResponseType> => {
    const response = await API.get(`/workspace/members/${workspaceId}`)
    return response.data
}

export const changeWorkspaceMemberRoleMutationFn = async ({ workspaceId, data }: ChangeMemberRoleInWorkspacePayloadType) => {
    const response = await API.put(`/workspace/change/member/role/${workspaceId}`, data)
    return response.data
}

export const deleteWorkspaceMutationFn = async (workspaceId: string): Promise<DeleteWorkspaceResponseType> => {
    const response = await API.delete(`/workspace/delete/${workspaceId}`)
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

export const editProjectMutationFn = async ({ workspaceId, projectId, data }: EditProjectPayloadType): Promise<ProjectResponseType> => {
    const response = await API.put(`/project/${projectId}/workspace/${workspaceId}/update`, data)
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

export const getProjectByIdQueryFn = async ({ workspaceId, projectId }: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
    const response = await API.get(`/project/${projectId}/workspace/${workspaceId}`)
    return response.data
}

export const getProjectAnalyticsQueryFn = async ({ workspaceId, projectId }: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
    const response = await API.get(`/project/${projectId}/workspace/${workspaceId}/analytics`)
    return response.data
}

export const deleteProjectMutationFn = async ({ workspaceId, projectId }: ProjectByIdPayloadType): Promise<{ message: string }> => {
    const response = await API.delete(`/project/${projectId}/workspace/${workspaceId}/delete`)
    return response.data
}



/*****************************Task */

export const createTaskMutationFn = async ({ workspaceId, projectId, data }: CreateTaskPayloadType) => {
    const response = await API.post(`/task/project/${projectId}/workspace/${workspaceId}/create`, data)
    return response.data
}

export const editTaskMutationFn = async ({ taskId, workspaceId, projectId, data }: EditTaskPayloadType): Promise<{ message: string }> => {
    const response = await API.put(`/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update`, data)
    return response.data
}

export const getAllTasksQueryFn = async ({
    workspaceId,
    keyword,
    projectId,
    assignedTo,
    priority,
    status,
    dueDate,
    pageNumber,
    pageSize
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
    const baseUrl = `/task/workspace/${workspaceId}/all`;

    const queryParams = new URLSearchParams();
    if (keyword) queryParams.set("keyword", keyword);
    if (projectId) queryParams.set("projectId", projectId);
    if (assignedTo) queryParams.set("assignedTo", assignedTo);
    if (priority) queryParams.set("priority", priority);
    if (status) queryParams.set("status", status);
    if (dueDate) queryParams.set("dueDate", dueDate);
    if (pageNumber) queryParams.set("pageNumber", String(pageNumber));
    if (pageSize) queryParams.set("pageSize", String(pageSize));

    const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl
    const response = await API.get(url)
    return response.data
}

export const deleteTaskMutationFn = async ({
    workspaceId,
    taskId,
}: {
    workspaceId: string;
    taskId: string;
}): Promise<{
    message: string;
}> => {
    const response = await API.delete(
        `task/${taskId}/workspace/${workspaceId}/delete`
    );
    return response.data;
};