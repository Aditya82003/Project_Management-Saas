import EmojiPickerComponent from "@/components/emoji-picker"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import { createProjectMutationFn } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { PopoverContent } from "@radix-ui/react-popover"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useNavigate } from "react-router"
import { toast } from "sonner"
import z from "zod"

const CreateProjectForm = ({ onClose }: { onClose: () => void }) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const workspaceId = useWorkspaceId()

    const [emoji, setEmoji] = useState("📊")

    const { mutate, isPending } = useMutation({
        mutationFn: createProjectMutationFn
    })

    const fromSchema = z.object({
        name: z.string().trim().min(1, {
            message: "Project title is Required"
        }),
        description: z.string().trim(),
    })

    const form = useForm<z.infer<typeof fromSchema>>({
        resolver: zodResolver(fromSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })

    const handleEmojiSelection = (emoji: string) => {
        setEmoji(emoji);
    };

    const onSubmit = (values :z.infer<typeof fromSchema>) => {
        if(isPending) return
        const payload={
            workspaceId,
            data:{
                emoji,
                ...values
            }
        }
        console.log(payload,"payload")
        mutate(payload,{
            onSuccess(data) {
                const project=data.project
                queryClient.invalidateQueries({
                    queryKey: ["allProjects",workspaceId]
                })
                toast.success("Project created successfully")
                navigate(`/workspace/${workspaceId}/project/${project.id}`)
                setTimeout(() => onClose(), 500);
            },
            onError:(error)=>{
                console.log(error)
                toast.error("Something went wrong")
            }
        })
    }
    return (
        <div className="w-full h-auto max-w-full">
            <div className="h-full">
                <div className="mb-5 pb-2 border-b">
                    <h1 className="text-xl font-semibold mb-1 text-center sm:text-left tracking-[-0.16] dark:text-[#fcfdffef]">Create Project</h1>
                    <p className="text-muted-foreground text-sm leading-tight">Organize and manage tasks,resources,and team collaboration</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" >Select Emoji</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className="font-normal size-[60ox] !p-2 !shadow-none mt-2 items-center rounded-full">
                                        <span className="text-4xl">{emoji}</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="!p-0">
                                    <EmojiPickerComponent onSelectEmoji={handleEmojiSelection} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                            Project title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Website Redesign"
                                                className="!h-[48px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                            Project Description
                                            <span className="text-xs font-extralight ml-2">Optional</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Project Description"
                                                className="!h-[48px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>

                        <Button
                            disabled={isPending}
                            className="flex place-self-end  h-[40px] text-white font-semibold"
                            type="submit"
                        >
                            {isPending && <Loader className="animate-spin" />}
                            Create
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
export default CreateProjectForm