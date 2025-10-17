import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { Permissions } from "@/constant"
import { useAuthContext } from "@/context/auth-provider"
import useGetWorkspacMembers from "@/hooks/api/use-get-workspace-members"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import { changeWorkspaceMemberRoleMutationFn } from "@/lib/api"
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper"
import { PopoverTrigger } from "@radix-ui/react-popover"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronDown, Loader } from "lucide-react"
import { toast } from "sonner"

const Allmembers = () => {
    const { user, hasPermission } = useAuthContext()

    const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE)

    const queryClient = useQueryClient()
    const workspaceId = useWorkspaceId()

    const { data, isPending } = useGetWorkspacMembers(workspaceId)

    const members = data?.members || []
    const roles = data?.roles || []

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: changeWorkspaceMemberRoleMutationFn
    })

    const handleSelect = (roleId: string, memberId: string) => {
        console.log(memberId , "Member ID")
        if (!roleId || !memberId) return
        const payload = {
            workspaceId,
            data: {
                roleId,
                memberId
            }
        }
        mutate(payload, {
            onSuccess: (data) => {
                console.log(data)
                queryClient.invalidateQueries({
                    queryKey: ["members", workspaceId]
                })
                toast.success("Member role updated successfully")
            },
            onError: (error) => {
                console.log(error)
                toast.error(error.message)
            }
        })
    }
    return (
        <div>
            {isPending ? (
                <Loader className=" w-8 h-8 place-self-center flex animate-spin" />
            ) : (null)}
            {members.map((member) => {
                const name = member.user.name
                const initials = getAvatarFallbackText(name)
                const avatarColor = getAvatarColor(name)
                return (
                    <div className="flex items-center justify-between space-x-4 space-y-4  ">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={member.user.profilePicture || ""} alt={name} />
                                <AvatarFallback className={avatarColor} >{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium leading-none">{name}</p>
                                <p className="text-sm text-muted-foreground">{member.user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        className="ml-auto min-w-24 capitalize disabled:opacity-95 disabled:pointer-events-none"
                                        disabled={!canChangeMemberRole || member.user.id === user?.id}>
                                        {member.role.role?.toLowerCase()}{" "}
                                        {canChangeMemberRole && member.user.id !== user?.id && (
                                            <ChevronDown className="text-muted-foreground" />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                {canChangeMemberRole && (
                                    <PopoverContent className="!p-0" align="end">
                                        <Command>
                                            <CommandInput placeholder="Select new role..."
                                                disabled={isLoading}
                                                className="disabled:pointer-events-none" />
                                            <CommandList>
                                                {isLoading ? (<Loader className=" w-8 h-8 place-sef-center flex my-4 animate-spin" />) :
                                                    (
                                                        <>
                                                            <CommandEmpty>No results found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {roles.map((role) => role.role !== "OWNER" && (
                                                                    <CommandItem
                                                                        key={role.id}
                                                                        disabled={isLoading}
                                                                        className="disabled:pointer-events-none gap-1 mb-1  flex flex-col items-start px-4 py-2 cursor-pointer"
                                                                        onSelect={() => handleSelect(role.id, member.id)}>
                                                                        <p className="capitalize">{role.role?.toLowerCase()}</p>
                                                                        <p className="text-sm text-muted-foreground">{role.role === "ADMIN" && `Can view, create, edit tassks, project and manage settings .`}
                                                                            {role.role === "MEMBER" && `Can view, edit only task created by.`}
                                                                        </p>
                                                                    </CommandItem>
                                                                ))
                                                                }
                                                            </CommandGroup>
                                                        </>
                                                    )}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                )}

                            </Popover>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default Allmembers