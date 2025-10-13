import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useGetWorkspacMembers from "@/hooks/api/use-get-workspace-members"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper"
import { format } from "date-fns"
import { Loader } from "lucide-react"

const RecentMembers = () => {
    const workspaceId = useWorkspaceId()
    const { data, isPending } = useGetWorkspacMembers(workspaceId)

    const members = data?.members || []
    return (
        <div>
            {isPending ? (
                <Loader
                    className="w-8 h-8 animate-spin place-self-center flex" />
            ) : null}
            <ul role="list" className="space-y-3">
                {members.map((member,index) => {
                    const name=member.user?.name
                    const initials=getAvatarFallbackText(name)
                    const avatarColor=getAvatarColor(name)
                    return(
                        <li key={index}
                            role="listitem"
                            className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                            <div className="flex-shrink-0">
                                <Avatar className="h-9 w-9 sm:flex">
                                    <AvatarImage src={member.user?.profilePicture || ""} alt="Avatar"/>
                                    <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold text-gray-900">{member.user.name}</p>
                                <p className="text-sm text-gray-500">{member.role.role}</p>
                            </div>
                            <div className="ml-auto text-sm text-gray-500">
                                <p>Joined</p>
                                <p>{member.joinedAt ? format(member.joinedAt ,"PPP") : null}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default RecentMembers