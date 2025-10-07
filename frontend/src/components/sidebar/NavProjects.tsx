import { Link, useLocation, useNavigate } from 'react-router'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'
import { ArrowRight, Folder, Loader, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import useWorkspaceId from '@/hooks/use-worksapce-id'
import { use, useState } from 'react'
import useGetProjectsInWorkspaceQuery from '@/hooks/api/use-get-project'
import type { Pagination } from '@/types/api.types'
import { Button } from '../ui/button'
import PermissionGuard from '../resuable/permission-guard'
import { Permissions } from '@/constant'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSubContent } from '../ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import useCreateProjectDialog from '@/hooks/use-create-project-dialog'

const NavProjects = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const { onOpen } = useCreateProjectDialog()

  const queryClient = useQueryClient()
  const workspaceId = useWorkspaceId()

  const { isMobile } = useSidebar()
  const [pageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const { data, isPending, isFetching, isError } = useGetProjectsInWorkspaceQuery({
    workspaceId,
    pageSize,
    pageNumber
  })
  const projects = data?.projects || []
  const pagination = data?.pagination || ({} as Pagination)
  const hasMore = pagination.totalPages > pageNumber

  const fetchNextPage = () => {
    if (!hasMore || isFetching) return
    setPageSize((prev) => prev + 5)
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel className='w-full justify-between pr-0'>
        <span>Projects</span>
        <PermissionGuard requiredPermission={Permissions.CREATE_PROJECT}>
          <button
            onClick={onOpen}
            type='button'
            className='flex size-5 items-center justify-center rounded-full border'>
            <Plus className='size-3.5' />
          </button>
        </PermissionGuard>
      </SidebarGroupLabel>
      <SidebarMenu className='scrollbar overflow-y-auto pb-2 h-[320px]'>
        {isError ? <div>Error occured</div> : null}
        {isPending ? (
          <Loader
            className='w-5 h-5 animate-spin place-self-center'
          />
        ) : null}

        {!isPending && projects.length === 0 ? (
          <div className='pl-3'>
            <p className='text-xs text-muted-foreground'>There is no project in this workspace yet.Project you  create will show up here</p>
            <PermissionGuard requiredPermission={Permissions.DELETE_PROJECT}>
              <Button
                onClick={onOpen}
                variant={'link'}
                type='button'
                className='text-[13px] underline font-semibold mt-4 p-0 h-0'
              >
                Create a Project
                <ArrowRight />
              </Button>
            </PermissionGuard>
          </div>

        ) : (
          projects.map((project) => {
            const projectUrl = `/workspace/${workspaceId}/project/${project.id}`
            return (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton asChild isActive={projectUrl === pathname}>
                  <Link to={projectUrl}>{project.emoji}<span>{project.name}</span></Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction>
                      <MoreHorizontal />
                      <span className='sr-only'>More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem
                      onClick={() => navigate(`${projectUrl}`)}
                    >
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>

                    <PermissionGuard
                      requiredPermission={Permissions.DELETE_PROJECT}
                    >
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        // disabled={isLoading}
                      // onClick={() => onOpenDialog(item)}
                      >
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </PermissionGuard>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )
          })
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavProjects