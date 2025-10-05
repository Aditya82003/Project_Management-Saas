import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-project"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import { Loader } from "lucide-react"


const RecentProject = () => {
    const workspaceId=useWorkspaceId()

    const {data,isPending}=useGetProjectsInWorkspaceQuery({
        workspaceId,
        pageNumber:1,
        pageSize:10
    })
    const projects=data?.projects
    console.log(projects)
  return (
    <div className="flex flex-col pt-2">
        {isPending?(
            <Loader className="w-8 h-8 animate-spin place-self-center flex"/>
        ):null}
        {projects?.length === 0 && (
            <div
                className="font-semibold text-sm text-muted-foreground text-center py-5"
            >
                No Project Created yet
            </div>
        )}
        <ul role="list" className="space-y-2">
            {projects?.map()}
        </ul>
    </div>
    
  )
}

export default RecentProject