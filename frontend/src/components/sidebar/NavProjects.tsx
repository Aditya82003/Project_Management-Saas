import { SidebarGroup, SidebarGroupLabel } from '../ui/sidebar'
import { Plus } from 'lucide-react'

const NavProjects = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className='w-full justify-between pr-0'>
        <span>Projects</span>
        <button 
        type='button'
        className='flex size-5 items-center justify-center rounded-full border'>
          <Plus className='size-3.5'/>
        </button>
      </SidebarGroupLabel>
    </SidebarGroup>
  )
}

export default NavProjects