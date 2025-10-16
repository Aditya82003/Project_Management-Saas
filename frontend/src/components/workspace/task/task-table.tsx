import useWorkspaceId from "@/hooks/use-worksapce-id"
import {  useState } from "react"
import { useParams } from "react-router"
import { DataTable } from "./table/table"
import { useQuery } from "@tanstack/react-query"
import useTaskTableFilter from "@/hooks/api/use-task-table-filter"
import type { TaskType } from "@/types/api.types"
import { getColums } from "./table/columns"
import { getAllTasksQueryFn } from "@/lib/api"
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-project"
import useGetWorkspacMembers from "@/hooks/api/use-get-workspace-members"
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { priorities, statuses } from "./table/data"
import { X } from "lucide-react"
import { DataTableFacetedFilter } from "./table/table-faceted-filter"


type Filters = ReturnType<typeof useTaskTableFilter>[0];
type SetFilters = ReturnType<typeof useTaskTableFilter>[1];

interface DataTableFilterToolbarProps {
  isLoading?: boolean;
  projectId?: string;
  filters: Filters;
  setFilters: SetFilters;
}

const TaskTable = () => {
    const params = useParams()
    const projectId = params.projectId

    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // const [taskList, setTaskList] = useState()
    const workspaceId = useWorkspaceId()
    const columns = getColums()

    const [filters, setFilters] = useTaskTableFilter()

    const { data, isLoading} = useQuery({
        queryKey: ["all-tasks", workspaceId, pageNumber, pageSize, filters, projectId],
        queryFn: () => getAllTasksQueryFn({
            workspaceId,
            keyword: filters.keyword,
            priority: filters.priority,
            status: filters.status,
            projectId: projectId || filters.projectId,
            assignedTo: filters.assignedToId,
            pageNumber,
            pageSize
        }),
        staleTime: 0
    })

    console.log(data?.tasks)

    const tasks: TaskType[] = data?.tasks || []
    const totalCount = data?.pagination.totalCount || 0

    const handlePageChange = (page: number) => {
        setPageNumber(page)
    }

    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
    }
    return (
        <div className="w-full relative">
            <DataTable
                isLoading={isLoading}
                data={tasks}
                columns={columns}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pagination={{
                    totalCount,
                    pageNumber,
                    pageSize
                }}
                filtersToolbar={<DataTableFilterToolbar
                    isLoading={isLoading}
                    projectId={projectId}
                    filters={filters}
                    setFilters={setFilters}
                />}
            />
        </div>
    )
}

const DataTableFilterToolbar = ({
    isLoading,
    projectId,
    filters,
    setFilters
}: DataTableFilterToolbarProps) => {
    const workspaceId = useWorkspaceId()

    const { data } = useGetProjectsInWorkspaceQuery({
        workspaceId
    })
    const { data: memberData } = useGetWorkspacMembers(workspaceId)

    const projects = data?.projects || []
    const members = memberData?.members || []

    const projectOptions = projects?.map((project) => {
        return {
            label: (
                <div className="flex items-center gap-1">
                    <span>{project.emoji}</span>
                    <span>{project.name}</span>
                </div>
            ),
            value: project.id,
        };
    })

    const assigneesOptions = members?.map((member) => {
        const name = member.user?.name || "Unknown";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);

        return {
            label: (
                <div className="flex items-center space-x-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={member.user?.profilePicture || ""} alt={name} />
                        <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                </div>
            ),
            value: member.user.id,
        };
    });

    const handleFilterChange = (key: keyof Filters, values: string[]) => {
        console.log(key,values)
        setFilters({
            ...filters,
            [key]: values.length > 0 ? values.join(",") : null,
        });
    };
    return (
        <div className="flex flex-col lg:flex-row w-full items-start space-y-2 mb-2 lg:mb-0 lg:space-x-2  lg:space-y-0">
            <Input
                placeholder="Filter tasks..."
                value={filters.keyword || ""}
                onChange={(e) =>
                    setFilters({
                        keyword: e.target.value,
                    })
                }
                className="h-8 w-full lg:w-[250px]"
            />
            {/* Status filter */}
             <DataTableFacetedFilter
                title="Status"
                multiSelect={true}
                options={statuses}
                disabled={isLoading}
                selectedValues={filters.status?.split(",") || []}
                onFilterChange={(values) => handleFilterChange("status", values)}
            />

            {/* Priority filter */}
            <DataTableFacetedFilter
                title="Priority"
                multiSelect={true}
                options={priorities}
                disabled={isLoading}
                selectedValues={filters.priority?.split(",") || []}
                onFilterChange={(values) => handleFilterChange("priority", values)}
            />

            {/* Assigned To filter */}
            <DataTableFacetedFilter
                title="Assigned To"
                multiSelect={true}
                options={assigneesOptions}
                disabled={isLoading}
                selectedValues={filters.assignedToId?.split(",") || []}
                onFilterChange={(values) => handleFilterChange("assignedToId", values)}
            />

           {!projectId && (
                <DataTableFacetedFilter
                    title="Projects"
                    multiSelect={false}
                    options={projectOptions}
                    disabled={isLoading}
                    selectedValues={filters.projectId?.split(",") || []}
                    onFilterChange={(values) => handleFilterChange("projectId", values)}
                />
            )} 

            {Object.values(filters).some(
                (value) => value !== null && value !== ""
            ) && (
                    <Button
                        disabled={isLoading}
                        variant="ghost"
                        className="h-8 px-2 lg:px-3"
                        onClick={() =>
                            setFilters({
                                keyword: null,
                                status: null,
                                priority: null,
                                projectId: null,
                                assignedToId: null,
                            })
                        }
                    >
                        Reset
                        <X />
                    </Button>
                )}
        </div>

    )
}
export default TaskTable