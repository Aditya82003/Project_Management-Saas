import { Button } from "@/components/ui/button"
import Roomheader from "@/components/workspace/Room/Roomheader"
import { VideoUI } from "@/components/workspace/Room/VideoUI"
import { useAuthContext } from "@/context/auth-provider"
import { useSocketContext } from "@/context/socket-provider"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import type { UserType } from "@/types/api.types"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"

const Roomjoin = () => {
    const { roomId } = useParams()
    const { user } = useAuthContext()
    const { socket, isConnected } = useSocketContext()
    const [joined, setJoined] = useState(true)
    const [peer, setPeer] = useState<{ socketId: string, username: string }>()
    const navigate=useNavigate()
    const workspaceId =useWorkspaceId()

    const handleLeave = () => {
        if (socket && roomId && joined) {
            socket.emit("leave-room", { roomId });
            setJoined(false);
            setPeer(undefined);
            toast.success("You left the room");
            navigate(`/workspace/${workspaceId}/video-call`)
        }
    };

    useEffect(() => {
        if (!socket) return

        const handleUserJoined = ({ socketId, username }: { socketId: string, username: string }) => {
            toast.success(`${username} with socketId ${socketId} joined the room`)
            setPeer({ socketId, username })
        }
        const handleUserleft = ({ socketId }: { socketId: string }) => {
            toast.success(`${socketId} left the room`)
            setPeer(undefined)
        }
        socket?.on("user-joined", handleUserJoined)
        socket.on("user-left", handleUserleft)

        return () => {
            socket?.off("user-joined", handleUserJoined)
            socket.off("user-left", handleUserleft)
            if (!joined && roomId) {
                socket.emit("leave-room", { roomId })
            }
        }
    }, [socket, user, roomId])
    return (
        <>
            <Roomheader user={user as UserType} socket={socket} isConnected={isConnected} />
            <VideoUI targetUserId={peer?.socketId as string} />
            <Button onClick={handleLeave}>Leave</Button>
        </>
    )
}

export default Roomjoin