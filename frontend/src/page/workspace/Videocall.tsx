import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/context/auth-provider"
import { useSocketContext } from "@/context/socket-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@radix-ui/react-separator"
import { Mic, MicOff, VideoIcon, VideoOff } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import z from "zod"

const Videocall = () => {
  const navigate = useNavigate()
  const { socket } = useSocketContext()
  const { user, workspace } = useAuthContext()

  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoAudio, setVideoAudio] = useState({ video: false, audio: false })

  const formSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    roomId: z.string().min(1, { message: "Room ID is required" }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", roomId: "" },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { roomId, username } = values
    socket?.emit("join-room", { username, roomId })
    // navigate(`/workspace/${workspace?.id}/video-call/${roomId}?video=${videoAudio.video},audio=${videoAudio.audio}`)
  }

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoAudio.video,
          audio: videoAudio.audio,
        })
        if (videoRef.current) videoRef.current.srcObject = stream
        setError(null)

      } catch (err) {
        setError("Unable to access camera: " + (err as Error).message)
      }
    }

    startCamera()
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [videoAudio, error])

  useEffect(() => {
    if (user) form.setValue("username", user.name)
  }, [user, form])

  useEffect(() => {
    if(!socket) return
    const handleRoomJoined = ({ roomId, socketId }: { roomId: string, socketId: string }) => {
      const query=new URLSearchParams({
        Id:socketId,
        video:String(videoAudio.video),
        audio:String(videoAudio.audio)
      }).toString()

      console.log(`${socketId} - is successfully joined`)
      navigate(`/workspace/${workspace?.id}/video-call/${roomId}?${query}`)
    }
    socket?.on("room-joined", handleRoomJoined)

    return () => {
      socket?.off("room-joined", handleRoomJoined)
    }
  }, [socket, navigate, videoAudio, workspace])

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full min-h-[calc(100vh-5rem)] px-4 py-8 bg-gradient-to-b from-background to-muted/30">
      {/* Video Preview Section */}
      <div className="flex flex-col items-center justify-center bg-card rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h1 className="text-lg font-semibold text-muted-foreground mb-4 border-b w-full text-center pb-2">
          Camera Preview
        </h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="relative w-full aspect-video bg-muted rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!videoAudio.video && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/70 text-sm text-muted-foreground">
              Camera is off
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            type="button"
            className="p-3 rounded-full bg-muted hover:bg-muted/70 transition"
            onClick={() =>
              setVideoAudio((prev) => ({ ...prev, audio: !prev.audio }))
            }
          >
            {videoAudio.audio ? (
              <Mic className="w-6 h-6 text-green-500" />
            ) : (
              <MicOff className="w-6 h-6 text-red-500" />
            )}
          </button>

          <button
            type="button"
            className="p-3 rounded-full bg-muted hover:bg-muted/70 transition"
            onClick={() =>
              setVideoAudio((prev) => ({ ...prev, video: !prev.video }))
            }
          >
            {videoAudio.video ? (
              <VideoIcon className="w-6 h-6 text-green-500" />
            ) : (
              <VideoOff className="w-6 h-6 text-red-500" />
            )}
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
          <Logo />
          <span className="text-2xl font-bold tracking-tight">Team Sync</span>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <VideoIcon className="w-5 h-5" />
              <span>Join or Create a Room</span>
            </CardTitle>
            <Separator className="mt-2" />
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Room ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full text-base">
                  Connect with your team
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Videocall
