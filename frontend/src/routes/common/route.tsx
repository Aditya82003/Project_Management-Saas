import SignIn from '@/page/auth/sign-in'
import SignUp from '@/page/auth/sign-up'
import { AUTH_ROUTES, BASE_ROUTES, PROTECTED_ROUTES } from './routePaths'
import GoogleOAuthFailure from '@/page/auth/GoogleOAuthFailure'
import Dashboard from '@/page/workspace/Dashboard'
import ProjectDetails from '@/page/workspace/ProjectDetails'
import Settings from '@/page/workspace/Settings'
import Members from '@/page/workspace/Members'
import Tasks from '@/page/workspace/Tasks'


export const authenicationRoutePaths=[
    {path:AUTH_ROUTES.SIGN_IN,element:<SignIn />},
    {path:AUTH_ROUTES.SIGN_UP,element:<SignUp />},
    {path:AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK,element:<GoogleOAuthFailure/>},
]

export const baseRoutePaths=[
    {path:BASE_ROUTES.INVITE_URL,element:<SignIn />}
]

export const protectedRoutePaths=[
    {path:PROTECTED_ROUTES.CREATE,element:<h1>Create your workspace</h1>},
    {path:PROTECTED_ROUTES.WORKSPACE,element:<Dashboard />},
    {path:PROTECTED_ROUTES.TASKS,element:<Tasks />},
    {path:PROTECTED_ROUTES.MEMBERS,element:<Members />},
    {path:PROTECTED_ROUTES.SETTINGS,element:<Settings />},
    {path:PROTECTED_ROUTES.PROJECT_DETAILS,element:<ProjectDetails/>},
]