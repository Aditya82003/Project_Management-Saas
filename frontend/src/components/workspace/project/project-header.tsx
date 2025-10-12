import PermissionGuard from "@/components/resuable/permission-guard"
import { Permissions } from "@/constant"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import { getProjectByIdQueryFn } from "@/lib/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import EditProjectDialog from "./edit-project-dialog"
import CreateTaskDialog from "../task/create-task-dialog"


const ProjectHeader = () => {
    const param = useParams()
    const projectId = param.projectId as string

    const workspaceId = useWorkspaceId()

    const { data, isPending, isError } = useQuery({
        queryKey: ["singleProject", projectId],
        queryFn: () =>
            getProjectByIdQueryFn({
                workspaceId,
                projectId
            }),
        staleTime: Infinity,
        enabled: !!projectId,
        placeholderData: keepPreviousData
    })

    const project = data?.project

    const projectEmoji = project?.emoji || "🚀"
    const projectName = project?.name || "Project Untitle"

    const renderContent = () => {
        if (isPending) return <span>Loading...</span>
        if (isError) return <span>Error Occured</span>
        return (
            <>
                <span>{projectEmoji}</span>
                {projectName}
            </>
        )
    }

    return (
        <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="flex items-center gap-3 text-xl font-medium truncate tracking-tight">{renderContent()}</h2>
                <PermissionGuard requiredPermission={Permissions.EDIT_PROJECT}>
                    <EditProjectDialog project={project}/>
                </PermissionGuard>
            </div>
            <CreateTaskDialog projectId={projectId}/>

        </div>
    )
}

export default ProjectHeader