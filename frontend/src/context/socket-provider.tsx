import { createSocketConnection } from "@/utilis/socket";
import React, { createContext, useContext, useEffect } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null
    isConnected: boolean
}
const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
})

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = React.useState<Socket | null>(null)
    const [isConnected, setIsConnected] = React.useState<boolean>(false)

    useEffect(() => {
        const newSocket = createSocketConnection()
        setSocket(newSocket)

        newSocket.on("connect", () => {
            setIsConnected(true)
        })

        newSocket.on("disconnect", () => {
            setIsConnected(false);
        });

        return () =>{
            newSocket.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocketContext = () => useContext(SocketContext)