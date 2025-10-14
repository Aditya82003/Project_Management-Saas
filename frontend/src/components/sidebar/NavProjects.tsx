import { Link, useLocation, useNavigate } from 'react-router'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'
import { ArrowRight, Folder, Loader, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useWorkspaceId from '@/hooks/use-worksapce-id'
import { useState } from 'react'
import useGetProjectsInWorkspaceQuery from '@/hooks/api/use-get-project'
import type { Pagination } from '@/types/api.types'
import { Button } from '../ui/button'
import PermissionGuard from '../resuable/permission-guard'
import { Permissions } from '@/constant'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import useCreateProjectDialog from '@/hooks/use-create-project-dialog'
import { ConfirmDialog } from '../resuable/confirm-dialog'
import useConfirmDialog from '@/hooks/use-confirm-dialog'
import { deleteProjectMutationFn } from '@/lib/api'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const NavProjects = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const queryClient = useQueryClient()
  const workspaceId = useWorkspaceId()

  const { isMobile, open: sidebarOpen } = useSidebar()
  const { onOpen } = useCreateProjectDialog()
  const { open, context, onOpenDialog, onCloseDialog } = useConfirmDialog()

  const [pageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: deleteProjectMutationFn
  })

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

  const handleConfirm = () => {
    if (!context) return
    mutate({
      workspaceId,
      projectId: context?.id
    },
      {
        onSuccess: (_data) => {
          queryClient.invalidateQueries({
            queryKey: ["allProjects", workspaceId]
          });
          toast.success("Project deleted successfully")
          navigate(`/workspace/${workspaceId}`)
          setTimeout(() => onCloseDialog(), 500);
        },
        onError: (error) => {
          console.log(error)
          toast.error(error.message)
        }
      },
    )
  }
  return (
    <>
      <SidebarGroup className={`${sidebarOpen ? null :"px-0.5"}`} >
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
            sidebarOpen ? (<div className='pl-3'>
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
            </div>) : (
              <PermissionGuard requiredPermission={Permissions.CREATE_PROJECT}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"link"} className='w-5 h-5' type='button' onClick={onOpen}><Plus /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Create a project</TooltipContent>
                </Tooltip>
              </PermissionGuard>
            )

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
                          disabled={isLoading}
                          onClick={() => onOpenDialog(project)}
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
          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-sidebar-foreground/70"
                disabled={isFetching}
                onClick={fetchNextPage}
              >
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>{isFetching ? "Loading..." : "More"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
      <ConfirmDialog
        isOpen={open}
        isLoading={isLoading}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete ${context?.name || "this item"
          }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  )
}

export default NavProjects