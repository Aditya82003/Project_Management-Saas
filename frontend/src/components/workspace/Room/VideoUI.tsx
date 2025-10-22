import { useWebRTCContext } from "@/context/WebRtc-provider";
import { useRef, useEffect } from "react";


export const VideoUI = ({ targetUserId }: { targetUserId: string }) => {
  const { localStream, remoteStreams, startCall, endCall } = useWebRTCContext();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    console.log(remoteStreams)
    if (remoteVideoRef.current && remoteStreams) {
      remoteVideoRef.current.srcObject = remoteStreams[targetUserId];
    }
  }, [remoteStreams, targetUserId]);

  return (
    <div className="flex flex-col items-center py-12 gap-4">
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay muted className="rounded-lg w-64 h-48 bg-black" />
        {Object.entries(remoteStreams).map(([socketId, stream]) => (
          <div key={socketId} className="flex flex-col items-center">
            <video
              autoPlay
              className="rounded-lg w-64 h-48 bg-black"
              ref={(el) => {
                if (el) el.srcObject = stream;
              }}
            />
            <span className="text-sm mt-1">{socketId}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {targetUserId && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => startCall(targetUserId)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Start Call
            </button>
            <button
              onClick={() => endCall(targetUserId)}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              End Call
            </button>
            {Object.keys(remoteStreams).length > 0 && (
              <button
                onClick={() => endCall()}
                className="px-4 py-2 bg-red-700 text-white rounded mt-4"
              >
                End All Calls
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
