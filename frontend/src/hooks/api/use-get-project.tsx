import { getProjectsInWorkspaceQueryFn } from "@/components/lib/api"
import type { AllProjectPayloadType } from "@/types/api.types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useGetProjectsInWorkspaceQuery=({
    workspaceId,
    pageNumber,
    pageSize,
    skip=false
}:AllProjectPayloadType)=>{
    const query=useQuery({
        queryKey:["allProjects",workspaceId,pageNumber,pageSize],
        queryFn:()=>getProjectsInWorkspaceQueryFn({
            workspaceId,
            pageSize,
            pageNumber
        }),
        staleTime:Infinity,
        placeholderData:skip?undefined : keepPreviousData,
        enabled:!skip
    })

    return query
}

export default useGetProjectsInWorkspaceQuery