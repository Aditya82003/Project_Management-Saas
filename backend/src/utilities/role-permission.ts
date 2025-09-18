import { PermissionType, RoleType } from "../generated/prisma";

export const rolePremission: Record<RoleType, PermissionType[]> = {
    OWNER: [
        PermissionType.CREATE_WORKSPACE,
        PermissionType.EDIT_WORKSPACE,
        PermissionType.DELETE_WORKSPACE,
        PermissionType.MANAGE_WORKSPACE_SETTINGS,

        PermissionType.ADD_MEMBER,
        PermissionType.CHANGE_MEMBER_ROLE,
        PermissionType.REMOVE_MEMBER,

        PermissionType.CREATE_PROJECT,
        PermissionType.EDIT_PROJECT,
        PermissionType.DELETE_PROJECT,

        PermissionType.CREATE_TASK,
        PermissionType.EDIT_TASK,
        PermissionType.DELETE_TASK,

        PermissionType.VIEW_ONLY
    ],
    ADMIN: [
        PermissionType.ADD_MEMBER,
        PermissionType.CREATE_PROJECT,
        PermissionType.EDIT_PROJECT,
        PermissionType.DELETE_PROJECT,
        PermissionType.CREATE_TASK,
        PermissionType.EDIT_TASK,
        PermissionType.DELETE_TASK,
        PermissionType.MANAGE_WORKSPACE_SETTINGS,
        PermissionType.VIEW_ONLY,
    ],
    MEMBER: [
        PermissionType.CREATE_TASK,
        PermissionType.EDIT_TASK,
        PermissionType.DELETE_TASK,
    ]
}