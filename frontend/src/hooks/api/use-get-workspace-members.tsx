import { getMembersInWorkspaceQueryFn } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

const useGetWorkspacMembers = (workspaceId:string ) => {
    const query=useQuery({
        queryKey:["members",workspaceId],
        queryFn:()=>getMembersInWorkspaceQueryFn(workspaceId),
        staleTime:Infinity
    })
    return query
}

export default useGetWorkspacMembers