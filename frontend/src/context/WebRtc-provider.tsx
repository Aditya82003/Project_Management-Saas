import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocketContext } from "./socket-provider";
import { rtcConfig } from "@/utilis/rtcConfig";

type WebRtcContextProps = {
  localStream: MediaStream | null;
  remoteStreams: { [socketId: string]: MediaStream };
  startCall: (targetUserId: string) => void;
  endCall: (targetUserId?: string) => void;
};

const WebRTCContext = createContext<WebRtcContextProps>({
  localStream: null,
  remoteStreams: {},
  startCall: () => {},
  endCall: () => {},
});

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket } = useSocketContext();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [socketId: string]: MediaStream }>({});
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

  // 1️⃣ Get user media
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    })();
  }, []);

  // 2️⃣ Socket listeners
  useEffect(() => {
    if (!socket || !localStream) return;

    const setupPeerConnection = (socketId: string) => {
      const pc = new RTCPeerConnection(rtcConfig);

      // Add local tracks
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      // When remote track is received
      pc.ontrack = (event) => {
        setRemoteStreams((prev) => ({ ...prev, [socketId]: event.streams[0] }));
      };

      // ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { to: socketId, candidate: event.candidate });
        }
      };

      peerConnections.current.set(socketId, pc);
      return pc;
    };

    // Handle incoming offer
    const handleOffer = async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      const pc = setupPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { to: from, answer });
    };

    // Handle incoming answer
    const handleAnswer = async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
      const pc = peerConnections.current.get(from);
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    };

    // Handle incoming ICE candidate
    const handleCandidate = async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
      const pc = peerConnections.current.get(from);
      if (!pc) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleCandidate);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleCandidate);
      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      setRemoteStreams({});
    };
  }, [socket, localStream]);

  // 3️⃣ Start call
  const startCall = async (targetUserId: string) => {
    if (!socket || !localStream) return;
    if (peerConnections.current.has(targetUserId)) return;

    const pc = new RTCPeerConnection(rtcConfig);

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({ ...prev, [targetUserId]: event.streams[0] }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { to: targetUserId, candidate: event.candidate });
      }
    };

    peerConnections.current.set(targetUserId, pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("offer", { to: targetUserId, offer });
  };

  // 4️⃣ End call
  const endCall = (targetUserId?: string) => {
    if (targetUserId) {
      const pc = peerConnections.current.get(targetUserId);
      pc?.close();
      peerConnections.current.delete(targetUserId);
      setRemoteStreams((prev) => {
        const copy = { ...prev };
        delete copy[targetUserId];
        return copy;
      });
    } else {
      // End all calls
      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      setRemoteStreams({});
    }
  };

  return (
    <WebRTCContext.Provider value={{ localStream, remoteStreams, startCall, endCall }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTCContext = () => useContext(WebRTCContext);
