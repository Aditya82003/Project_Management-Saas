export const AUTH_ROUTES = {
    SIGN_IN: "/",
    SIGN_UP: "/sign-up",
    GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback"
}

export const PROTECTED_ROUTES = {
    CREATE:"/workspace/create",
    WORKSPACE: "/workspace/:workspaceId",
    TASKS: "/workspace/:workspaceId/tasks",
    MEMBERS: "/workspace/:workspaceId/members",
    SETTINGS: "/workspace/:workspaceId/settings",
    PROJECT_DETAILS: "/workspace/:workspaceId/project/:projectId",
    VIDEO_CALL: "/workspace/:workspaceId/video-call",
    ROOM:"/workspace/:workspaceId/video-call/:roomId"
}

export const BASE_ROUTES = {
    INVITE_URL: "/invite/workspace/:inviteCode/join",
}