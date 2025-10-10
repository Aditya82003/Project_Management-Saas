import EmojiPickerComponent from "@/components/emoji-picker"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import type { ProjectType } from "@/types/api.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, type FC } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
interface EditProjectFormProps {
    onClose: () => void,
    project?: ProjectType
}
const EditProjectForm: FC<EditProjectFormProps> = ({ onClose, project }) => {
    console.log(project, onClose)

    const workspaceId = useWorkspaceId()
    const queryClient = useQueryClient()

    const [emoji, setEmoji] = useState("📊")
    const projectId = project?.id as string

    // const { mutate, isPending } = useMutation({
    //     mutationFn: editProjectMutationFn

    // })

    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Name is required"
        }),
        description: z.string().trim()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: project?.name as string,
            description: project?.description as string
        }
    })

    const handleEmojiSelection=(emoji:string)=>{
        setEmoji(emoji)
    }

    const onSubmit = (value:z.infer<typeof formSchema>)=>{

    }

    return (
        <div className="w-full h-auto max-w-full">
            <div className="h-full">
                <div className=" mb-5 pv-2 border-b">
                    <h1 className="text-xl font-semibold mb-1 text-center sm:text-left tracking-[-0.16px] dark:text-[#fcfdffef]">Edit Project</h1>
                    <p className="text-muted-foreground text-sm leading-tight">Update the project details to refine task management</p>
                </div>
                <Form {...form} >
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Select Emoji</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className="font-normal size-[60px] !p-2 !shadow-none mt-2 items-center rounded-full"><span className="text-4xl">{project?.emoji}</span></Button>
                                </PopoverTrigger>
                                <PopoverContent>
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
                                            Project Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="" className="!h-[48px] " {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                           Project Description
                                           <span className="text-xs font-extralight ml-2">
                                            Optional
                                           </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea rows={4} placeholder="Project description"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            className="flex place-self-end h-[40px] text-white font-semibold"
                            type="submit"
                        >
                            Update
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
export default EditProjectForm