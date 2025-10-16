import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { TaskType } from "@/types/api.types"
import type { Column, ColumnDef, Row } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./table-column-header"
import { formatStatusToEnum, getAvatarColor, getAvatarFallbackText } from "@/lib/helper"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { priorities, statuses } from "./data"
import { TaskPriorityEnum, TaskStatusEnum, type TaskPriorityEnumType, type TaskStatusEnumType } from "@/constant"


export const getColums = (projectId?: string): ColumnDef<TaskType>[] => {
    const columns: ColumnDef<TaskType>[] = [
        {
            id: "id",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "title",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Title" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-wrap space-x-2">
                        <Badge variant="outline" className="capitalize shrink-0 h-[25px]">
                            {row.original.taskCode}
                        </Badge>
                        <span className="block lg:max-w-[220px] max-w-[220px] font-medium">{row.original.title}</span>
                    </div>
                )
            }
        },
        ...(projectId ? [] : [
            {
                accessorKey: "project",
                header: ({ column }: { column: Column<TaskType, unknown> }) => (
                    <DataTableColumnHeader column={column} title="Project" />
                ),
                cell: ({ row }: { row: Row<TaskType> }) => {
                    const project = row.original.project
                    if (!project) return null
                    return (
                        <div className="flex items-center justify-center gap-1 ">
                            <span className="rounded-full border">{project.emoji}</span>
                            <span className="block capitalize truncate  w-[90px] text-ellipsis">{project.name}</span>
                        </div>
                    )
                }
            },
            {
                accessorKey: "assignedTo",
                header: ({ column }: { column: Column<TaskType, unknown> }) => (
                    <DataTableColumnHeader column={column} title="Assigned To" />
                ),
                cell: ({ row }: { row: Row<TaskType> }) => {
                    const assignee = row.original.assignedTo || null;
                    const name = assignee?.name || "";

                    const initials = getAvatarFallbackText(name);
                    const avatarColor = getAvatarColor(name);

                    return (
                        name && (
                            <div className="flex items-center justify-center gap-1">
                                <Avatar className="h-6 w-6  rounded-full overflow-hidden ">
                                    <AvatarImage src={assignee?.profilePicture || ""} alt={name} />
                                    <AvatarFallback className={avatarColor}>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="block text-ellipsis w-[100px] truncate">
                                    {assignee?.name}
                                </span>
                            </div>
                        )
                    )
                }
            },
            {
                accessorKey: "dueDate",
                header: ({ column }: { column: Column<TaskType, unknown> }) => (
                    <DataTableColumnHeader column={column} title="Due Date" />
                ),
                cell: ({ row }: { row: Row<TaskType> }) => {
                    return (
                        <span className="text-sm lg:max-w-[100px]">
                            {row.original.dueDate ? format(row.original.dueDate, "PPP") : null}
                        </span>
                    )
                }
            },
            {
                accessorKey: "status",
                header: ({ column }: { column: Column<TaskType, unknown> }) => (
                    <DataTableColumnHeader column={column} title="Status" />
                ),
                cell: ({ row }: { row: Row<TaskType> }) => {
                    const status = statuses.find(
                        (status) => status.value === row.getValue("status")
                    );
                    if (!status) {
                        return null;
                    }

                    const statusKey = formatStatusToEnum(
                        status.value
                    ) as TaskStatusEnumType
                    const Icon = status.iconMap

                    if (!Icon) {
                        return null;
                    }

                    return (
                        <div className="flex lg:w-[120px] items-center justify-center">
                            <Badge
                                variant={TaskStatusEnum[statusKey]}
                                className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                            >
                                <Icon className="h-4 w-4 rounded-full text-inherit" />
                                <span>{status.label}</span>
                            </Badge>
                        </div>
                    );
                }
            },
             {
      accessorKey: "priority",
      header: ({ column }:{column: Column<TaskType, unknown>}) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }:{row: Row<TaskType>}) => {
        const priority = priorities.find(
          (priority) => priority.value === row.getValue("priority")
        );

        if (!priority) {
          return null;
        }

        const statusKey = formatStatusToEnum(
          priority.value
        ) as TaskPriorityEnumType;
        const Icon = priority.iconMap;

        if (!Icon) {
          return null;
        }

        return (
          <div className="flex items-center justify-center">
            <Badge
              variant={TaskPriorityEnum[statusKey]}
              className="flex lg:w-[110px] p-1 gap-1  font-medium !shadow-none uppercase border-0"
            >
              <Icon className="h-4 w-4 rounded-full text-inherit" />
              <span>{priority.label}</span>
            </Badge>
          </div>
        );
      },
    },
           
        ])
    ]

    return columns

}