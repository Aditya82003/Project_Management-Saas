import { TaskPriorityEnum, TaskStatusEnum, type TaskPriorityEnumType, type TaskStatusEnumType } from "@/constant"
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"

const useTaskTableFilter=()=>{
    return useQueryStates({
        status: parseAsStringEnum<TaskStatusEnumType>(
            Object.values(TaskStatusEnum)
        ),
        priority: parseAsStringEnum<TaskPriorityEnumType>(
            Object.values(TaskPriorityEnum)
        ),
        keyword:parseAsString,
        projectId:parseAsString,
        assignedToId:parseAsString
    })

}
export default useTaskTableFilter