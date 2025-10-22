import { io, Socket } from 'socket.io-client'

const SOCKET_URL = "http://localhost:6001"

export const createSocketConnection = ():Socket => {
    const socket = io(SOCKET_URL,{
        transports: ['websocket'],
        withCredentials:true
    })

    return socket
}