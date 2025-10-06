import type { PermissionType } from "@/constant";
import useAuth from "@/hooks/api/use-auth";
import useGetWorkspaceQuery from "@/hooks/api/use-get-Workspace";
import usePermission from "@/hooks/use-permission";
import useWorkspaceId from "@/hooks/use-worksapce-id";
import type { UserType, WorkspaceType } from "@/types/api.types"
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

type AuthContextType = {
    user?: UserType;
    workspace?: WorkspaceType
    hasPermission:(permission:PermissionType)  => boolean 
    error: any
    isLoading: boolean
    isFetching: boolean
    workspaceLoading: boolean
    refetchAuth: () => void
    refetchWorkspace: () => void
}

type AuthProviderType = {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: AuthProviderType) => {
    const navigate = useNavigate()
    const workspaceId = useWorkspaceId()

    const { 
        data: authData, 
        error: authError, 
        isLoading, 
        isFetching, 
        refetch: refetchAuth 
    } = useAuth()
    const user = authData?.user

    const {
        data: workspaceData,
        error: workspaceError,
        isLoading: workspaceLoading,
        refetch: refetchWorkspace
    } = useGetWorkspaceQuery(workspaceId)

    const workspace=workspaceData?.workspace

    useEffect(()=>{
        if(workspaceError){
            if(workspaceError.errorCode==="ACCESS_UNAUTHORIZED"){
                navigate("/")
            }
        }
    },[navigate,workspaceError])

    const permissions= usePermission(user,workspace)
    const hasPermission=(permission:PermissionType):boolean =>{
        return permissions.includes(permission)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                workspace,
                hasPermission,
                error: authError || workspaceError,
                isLoading,
                isFetching,
                workspaceLoading,
                refetchAuth,
                refetchWorkspace
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};