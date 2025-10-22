import { useParams } from "react-router"
import AnalyticsCard from "../common/AnalyticsCard"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import { useQuery } from "@tanstack/react-query"
import { getProjectAnalyticsQueryFn } from "@/lib/api"

const ProjectAnalytics = () => {
    const params = useParams()
    const projectId = params.projectId as string
    const workspaceId = useWorkspaceId()

    const { data, isPending } = useQuery({
        queryKey: ["project-analytics", projectId],
        queryFn: () => getProjectAnalyticsQueryFn({ workspaceId, projectId }),
        staleTime: 0,
        enabled: !!projectId
    })

    const analytics = data?.analytics
    return (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <AnalyticsCard
                isLoading={isPending}
                title="Total Task"
                value={analytics?.totalTasks || 0}
            />
            <AnalyticsCard
                isLoading={isPending}
                title="Overdue Task"
                value={analytics?.overdueTask || 0}
            />
            <AnalyticsCard
                isLoading={isPending}
                title="Completed Task"
                value={analytics?.completedTask || 0}
            />
        </div>
    )
}

export default ProjectAnalytics