import SignIn from '@/page/auth/sign-in'
import SignUp from '@/page/auth/sign-up'
import { AUTH_ROUTES, BASE_ROUTES, PROTECTED_ROUTES } from './routePaths'
import GoogleOAuthFailure from '@/page/auth/GoogleOAuthFailure'
import Dashboard from '@/page/auth/workspace/Dashboard'


export const authenicationRoutePaths=[
    {path:AUTH_ROUTES.SIGN_IN,element:<SignIn />},
    {path:AUTH_ROUTES.SIGN_UP,element:<SignUp />},
    {path:AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK,element:<GoogleOAuthFailure/>},
]

export const baseRoutePaths=[
    {path:BASE_ROUTES.INVITE_URL,element:<SignIn />}
]

export const protectedRoutePaths=[
    {path:PROTECTED_ROUTES.WORKSPACE,element:<Dashboard />},
    {path:PROTECTED_ROUTES.TASKS,element:<SignIn />},
    {path:PROTECTED_ROUTES.MEMBERS,element:<SignIn />},
    {path:PROTECTED_ROUTES.SETTINGS,element:<SignIn />},
    {path:PROTECTED_ROUTES.PROJECT_DETAILS,element:<SignIn />},
]