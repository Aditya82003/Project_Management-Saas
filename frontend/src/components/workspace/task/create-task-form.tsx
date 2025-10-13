import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant"
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-project"
import useGetWorkspacMembers from "@/hooks/api/use-get-workspace-members"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import { createTaskMutationFn } from "@/lib/api"
import { getAvatarColor, getAvatarFallbackText, transformOptions } from "@/lib/helper"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const CreateTaskForm = (props: {
    projectId?: string,
    onClose: () => void
}) => {
    const { projectId, onClose } = props

    const queryClient = useQueryClient()
    const workspaceId = useWorkspaceId()

    const { mutate, isPending } = useMutation({
        mutationFn: createTaskMutationFn
    })

    const { data, isLoading } = useGetProjectsInWorkspaceQuery({
        workspaceId,
        skip: !!projectId
    })

    const { data: memberData } = useGetWorkspacMembers(workspaceId)

    const projects = data?.projects || []
    const members = memberData?.members || []
    console.log(memberData)

    const projectOptions = projects.map((project) => {
        return {
            label: (
                <div className="flex items-center gap-1">
                    <span>{project.emoji}</span>
                    <span>{project.name}</span>
                </div>
            ),
            value: project.id
        }
    })

    const memberOptions = members.map((member) => {
        const name = member.user.name || "Unkown"
        const initials = getAvatarFallbackText(name)
        const avatarColor = getAvatarColor(name)

        return {
            label: (
                <div className="flex gap-1 items-center ">
                    <Avatar className="w-7 h-7">
                        <AvatarImage src={member.user?.profilePicture || ""} alt={name} />
                        <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                </div>
            ),
            value: member.user?.id
        }
    })

    const formSchema = z.object({
        title: z.string().trim().min(1, {
            message: "Title is required"
        }),
        description: z.string().trim(),
        projectId: z.string().trim().min(1, {
            message: "Project is required"
        }),
        status: z.enum(
            Object.values(TaskStatusEnum) as [keyof typeof TaskStatusEnum],
            {
                message: "Status is required"
            }
        ),
        priority: z.enum(
            Object.values(TaskPriorityEnum) as [keyof typeof TaskPriorityEnum],
            {
                message: "Priority is required"
            }
        ),
        assignedToId: z.string().trim().min(1, {
            message: "AssignedTo is required"
        }),
        dueDate: z.date({
            error: "DueDate is required"
        })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            projectId: projectId ? projectId : "",
        }
    })

    const taskStatusList = Object.values(TaskStatusEnum)
    const taskPriorityList = Object.values(TaskPriorityEnum)

    const statusOptions = transformOptions(taskStatusList)
    const priorityOptions = transformOptions(taskPriorityList)



    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (isPending) return
        const payload = {
            workspaceId,
            projectId: values.projectId,
            data: {
                ...values,
            }
        }
        mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["project-analytics", projectId]
                })
                queryClient.invalidateQueries({
                    queryKey: ["all-tasks", workspaceId],
                });
                toast.success("Task created successfully")
                setTimeout(() => onClose(), 100);
            },
            onError: (error) => {
                console.log(error)
                toast.error(error.message)
            }
        })
    }
    return (
        <div className="w-full h-auto max-w-full">
            <div className="h-full">
                <div className="mb-5 pb-2 border-b">
                    <h1 className="text-xl font-semibold mb-1 tracking-[-0.16px] dark:text-[#fcfdffef]">Create Task</h1>
                    <p className="text-muted-foreground  text-sm leading-tight">Organize and manage tasks,resources, and team collaboration</p>
                </div>
                <Form {...form}>
                    <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* title */}
                        <div>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm dark:test-[#f1f7feb5]">Task Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Task Title" className="!h-[48px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* description */}
                        <div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm dark:test-[#f1f7feb5]">Task Discription
                                            <span className="text-muted-foreground font-extralight text-xs ml-2">Optional</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea rows={1} placeholder="Task Discription" className="!h-[48px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* project */}
                        <div>
                            {!projectId && (
                                <FormField
                                    control={form.control}
                                    name="projectId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a Project" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {isLoading && (
                                                        <div className="my-2">
                                                            <Loader className="w-4 h-4 place-self-center flex animate-spin" />
                                                        </div>
                                                    )}
                                                    <div className="w-full max-h-[200px] overflow-y-auto scrollbar">
                                                        {projectOptions.map((projectOption) => (
                                                            <SelectItem key={projectOption.value}
                                                                className="cursor-pointer !capitalize"
                                                                value={projectOption.value}
                                                            >{projectOption.label}</SelectItem>
                                                        ))}
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        {/* MEmber Assigned*/ }
                        <div>
                            <FormField
                                control={form.control}
                                name="assignedToId"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Assigned To</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="">
                                                <SelectTrigger className="w-full flex items-center !h-[48px]  ">
                                                    <SelectValue placeholder="Select a Member"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <div className="w-full max-h-[200px] overflow-y-auto scrollbar">
                                                    {memberOptions.map((option)=>(
                                                        <SelectItem  className="cursor-pointer" key={option.value} value={option.value}>{option.label}</SelectItem>
                                                    ))}
                                                </div>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                        </div>
                        {/* Due date */}
                        <div className="!mt-2">
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-full flex-1 pl-3 text-left font-normal", !field.value && "text-muted-background")}>
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )
                                                        }
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || date > new Date(new Date("2100-01-01"))}
                                                    autoFocus
                                                    defaultMonth={new Date()}
                                                    startMonth={new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        {/* status */}
                        <div>
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem  >
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger className="w-full" >
                                                    <SelectValue className="!capitalize !text-mute-forreground" placeholder="Select a Status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="">
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} className="!capitalize" value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* priority */}
                        <div>
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem  >
                                        <FormLabel>Priority</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full" >
                                                    <SelectValue className="!capitalize !text-mute-forreground" placeholder="Select a Priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="">
                                                {priorityOptions.map((option) => (
                                                    <SelectItem key={option.value} className="!capitalize" value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="flex place-self-end h-[40px] text-white font-semibold">Create</Button>

                    </form>
                </Form>
            </div>
        </div >
    )

}
export default CreateTaskForm