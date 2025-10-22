import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getAvatarColor, getAvatarFallbackText } from '@/lib/helper'
import type { UserType } from '@/types/api.types'
import { AvatarImage } from '@radix-ui/react-avatar'
import type { Socket } from 'socket.io-client'

interface RoomheaderProps {
  user: UserType
  socket: Socket | null
  isConnected: boolean
}
const Roomheader = ({ user, socket, isConnected }: RoomheaderProps) => {

  const name = user?.name
  const initials = getAvatarFallbackText(name)
  const avatarColor = getAvatarColor(name)
  return (
    <header className='flex sticky top-0 z-50 bg-white h-12 shrink-0 items-center border-b'>
      <div className='flex justify-between w-full items-center'>
        <div className="flex items-center space-x-4 ">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profilePicture || ''} alt={name} />
              <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-red-400'
                }`}
            />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">{name}</p>
          </div>
        </div>
        <div className="flex items-center min-w-0">
          <span className="text-sm font-semibold mr-2 shrink-0">Id:</span>
          <h1 className="text-sm text-muted-foreground max-sm:truncate max-sm:w-[100px]">
            {socket?.id}
          </h1>
        </div>
      </div>

    </header>
  )
}

export default Roomheader