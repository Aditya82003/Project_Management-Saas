import { Check, ChevronDown, Loader, Plus } from "lucide-react"
import { SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar"
import { useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import  { useEffect, useState } from "react"
import { getAllWorkspacesUserIsMemberQueryFn } from "../lib/api"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"

type WorkspaceType = {
    id: string,
    name: string
}
const WorkspaceSwitcher = () => {
    const navigate = useNavigate()
    const { isMobile } = useSidebar()

    const workspaceId = useWorkspaceId()

    const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>();

    const { data, isPending } = useQuery({
        queryKey: ["userworkspaces"],
        queryFn: getAllWorkspacesUserIsMemberQueryFn,
        staleTime: 1,
        refetchOnMount: true,
    })

    const workspaces = data?.workspaces

    useEffect(() => {
        if (workspaces?.length) {
            const workspace = workspaceId ? workspaces.find((ws) => ws.id === workspaceId)
                : workspaces[0]

            if (workspace) {
                setActiveWorkspace(workspace)
                if (!workspaceId) navigate(`/workspace/${workspace.id}`)
            }
        }
    }, [workspaces, workspaceId, navigate])

    const onSelect = (workspace: WorkspaceType) => {
        setActiveWorkspace(workspace)
        navigate(`/workspace/${workspace.id}`)
    }

    return (
        <>
            <SidebarGroupLabel className="w-full justify-between pr-0 ">
                <span>Workspaces</span>
                <button
                    className="flex size-5 items-center justify-center rounded-full border">
                    <Plus className="size-3.5" />
                </button>
            </SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-gray-10">
                                {activeWorkspace ? (
                                    <>
                                        <div className="flex aspect-square size-8 items-center font-semibold justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                            {activeWorkspace?.name?.split(" ")?.[0]?.charAt(0)}
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {activeWorkspace?.name}
                                            </span>
                                            <span className="truncate text-xs">Free</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            No Workspace selected
                                        </span>
                                    </div>
                                )}
                                <ChevronDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="start"
                            side={isMobile ? "bottom" : "right"}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
                            {isPending ? <Loader className="w-5 h-5 animate-spin" /> : null}

                            {workspaces?.map((workspace) => (
                                <DropdownMenuItem
                                    key={workspace.id}
                                    onClick={() => onSelect(workspace)}
                                    className="flex gap-2 p-2 !cursor-pointer"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        {workspace?.name?.split(" ")?.[0]?.charAt(0)}
                                    </div>
                                    {workspace.name}

                                    {workspace.id === workspaceId && (
                                        <DropdownMenuShortcut className="tracking-normal !opacity-100">
                                            <Check className="w-4 h-4" />
                                        </DropdownMenuShortcut>
                                    )}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex gap-2 p-2 !cursor-pointer"
                            // onClick={onOpen}
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">
                                    Add Worksapce
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

        </>
    )
}

export default WorkspaceSwitcher