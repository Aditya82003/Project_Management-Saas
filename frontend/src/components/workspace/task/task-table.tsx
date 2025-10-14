import useWorkspaceId from "@/hooks/use-worksapce-id"
import { use, useState } from "react"
import { useParams } from "react-router"
import { DataTable } from "./table/table"
import { useQuery } from "@tanstack/react-query"
import useTaskTableFilter from "@/hooks/api/use-task-table-filter"
import type { TaskType } from "@/types/api.types"

const TaskTable = () => {
    const params = useParams()
    const projectId = params.projectId

    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [taskList, setTaskList] = useState()
    const workspaceId = useWorkspaceId()
    // const columns=getColums

    const [filters, setFilters] = useTaskTableFilter()

    const { data, isPending } = useQuery({
        queryKey: ["all-tasks", workspaceId, pageNumber, pageSize, filters, projectId],
        queryFn: () => getAllTasksQueryFn({
            workspaceId,
            keyword: filters.keyword,
            priority: filters.priority,
            status: filters.status,
            projectId: projectId || filters.projectId,
            assignedToId: filters.assignedToId,
            pageNumber,
            pageSize
        }),
        staleTime: 0
    })

    const tasks:TaskType[]= data?.tasks || []
    const totalCount = data.pagination.totalCount || 0

    const handlePageChange = (page: number) => {
        setPageNumber(page)
    }

    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
    }
    return (
        <div>
            {/* <DataTable
            isLoading={isPending}
            data={tasks}
            columns={columns}


            /> */}
        </div>
    )

}
export default TaskTable