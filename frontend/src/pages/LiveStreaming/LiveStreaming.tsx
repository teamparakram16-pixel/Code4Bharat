import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import { useAuth } from "../../context/AuthContext";
declare global {
  interface Window {
    localStream: MediaStream | null;
  }
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

type VideoStream = {
  socketId: string;
  stream: MediaStream;
};

type ChatMessage = {
  sender: string;
  data: string;
};

export default function LiveStreaming() {
  const { user } = useAuth(); // ✅ grab user from AuthContext
  const username: string = user?.username || user?.name || "Guest";

  const socketRef = useRef<Socket | null>(null);
  const socketIdRef = useRef<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const connections = useRef<Record<string, RTCPeerConnection>>({});

  const [videos, setVideos] = useState<VideoStream[]>([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");

  // Get initial permissions (audio + video)
  const getPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled ? {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: 'user',
          aspectRatio: { ideal: 16/9 }
        } : false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2
        },
      });
      window.localStream = stream;
      if (localVideoRef.current && videoEnabled) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(console.error);
      }
    } catch (e) {
      console.error("Permissions error:", e);
      // If video fails, try audio only with high quality settings
      try {
        const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
            channelCount: 2
          },
        });
        window.localStream = audioOnlyStream;
        setVideoEnabled(false);
      } catch (audioError) {
        console.error("Audio permissions error:", audioError);
      }
    }
  };

  const toggleVideo = async () => {
    if (videoEnabled) {
      // Turn off video - stop camera access completely
      if (window.localStream) {
        // Stop video tracks to release camera
        window.localStream.getVideoTracks().forEach(track => {
          track.stop();
        });
        
        // Remove video tracks from peer connections
        Object.values(connections.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            pc.removeTrack(sender);
          }
        });
        
        // Remove video from local stream but keep audio
        const audioTracks = window.localStream.getAudioTracks();
        window.localStream = new MediaStream(audioTracks);
        
        // Clear video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
      }
      setVideoEnabled(false);
    } else {
      // Turn on video - request camera access with high quality settings
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920, max: 1920 },
            height: { ideal: 1080, max: 1080 },
            frameRate: { ideal: 30, max: 60 },
            facingMode: 'user',
            aspectRatio: { ideal: 16/9 }
          },
          audio: false
        });
        
        const videoTrack = videoStream.getVideoTracks()[0];
        
        // Add video track to existing stream
        if (window.localStream) {
          window.localStream.addTrack(videoTrack);
        } else {
          window.localStream = videoStream;
        }
        
        // Update video element with improved settings
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = window.localStream;
          localVideoRef.current.play().catch(console.error);
          // Ensure proper video rendering
          localVideoRef.current.onloadedmetadata = () => {
            localVideoRef.current?.play().catch(console.error);
          };
        }
        
        // Add video track to peer connections
        Object.values(connections.current).forEach(pc => {
          pc.addTrack(videoTrack, window.localStream as MediaStream);
        });
        
        setVideoEnabled(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        // Handle permission denied or camera not available
        alert("Unable to access camera. Please check your camera permissions and ensure no other application is using the camera.");
      }
    }
  };

  const toggleAudio = () => {
    if (window.localStream) {
      window.localStream
        .getAudioTracks()
        .forEach((t) => (t.enabled = !audioEnabled));
    }
    setAudioEnabled((prev) => !prev);
  };

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current) return;
    socketRef.current.emit("chat-message", message, username);
    setMessages((prev) => [...prev, { sender: username, data: message }]);
    setMessage("");
  };

  const createPeerConnection = (id: string, isOffer: boolean) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    connections.current[id] = pc;

    // Enhanced connection event handlers
    pc.onicecandidate = (e) => {
      if (e.candidate && socketRef.current) {
        socketRef.current.emit("signal", id, JSON.stringify({ ice: e.candidate }));
      }
    };

    pc.ontrack = (event) => {
      console.log(`Received track from ${id}:`, event.track.kind);
      const stream = event.streams[0];
      setVideos((prev) => {
        const exists = prev.find((v) => v.socketId === id);
        if (exists) {
          return prev.map((v) =>
            v.socketId === id ? { ...v, stream } : v
          );
        }
        return [...prev, { socketId: id, stream }];
      });
    };

    // Connection state monitoring
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${id}:`, pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.warn(`Connection with ${id} failed, attempting to reconnect...`);
        // Could implement reconnection logic here
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state with ${id}:`, pc.iceConnectionState);
    };

    // Add local tracks with enhanced error handling
    if (window.localStream) {
      window.localStream.getTracks().forEach((track) => {
        try {
          const sender = pc.addTrack(track, window.localStream as MediaStream);
          console.log(`Added ${track.kind} track to peer ${id}`);
          
          // Configure encoding for better quality
          if (track.kind === 'video') {
            const params = sender.getParameters();
            if (params.encodings && params.encodings.length > 0) {
              params.encodings[0].maxBitrate = 2000000; // 2 Mbps
              params.encodings[0].maxFramerate = 30;
              sender.setParameters(params).catch(console.error);
            }
          }
        } catch (error) {
          console.error(`Error adding ${track.kind} track:`, error);
        }
      });
    }

    if (isOffer) {
      // Enhanced offer creation with better codec preferences
      pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      })
        .then((desc) => {
          // Prefer VP9 codec for better quality if available
          if (desc.sdp) {
            desc.sdp = desc.sdp.replace(/VP8/g, 'VP9');
          }
          return pc.setLocalDescription(desc);
        })
        .then(() => {
          if (socketRef.current) {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: pc.localDescription })
            );
          }
        })
        .catch(error => {
          console.error(`Error creating offer for ${id}:`, error);
        });
    }
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        // Enhanced screen sharing with audio capture option
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: 1920, max: 4096 },
            height: { ideal: 1080, max: 2160 },
            frameRate: { ideal: 30, max: 60 }
          },
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 48000
          }
        });
        
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace video track in all peer connections
        Object.values(connections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            // Replace existing video track with screen share
            sender.replaceTrack(screenTrack).catch(console.error);
          } else {
            // Add screen share track if no video track exists
            pc.addTrack(screenTrack, screenStream);
          }
        });

        // Update local video to show screen share
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
          localVideoRef.current.play().catch(console.error);
        }

        // Handle screen share end (user clicks stop sharing in browser)
        screenTrack.onended = () => {
          stopScreenShare();
        };

        // Handle audio track if available
        const audioTracks = screenStream.getAudioTracks();
        if (audioTracks.length > 0) {
          const audioTrack = audioTracks[0];
          Object.values(connections.current).forEach((pc) => {
            pc.addTrack(audioTrack, screenStream);
          });
          
          audioTrack.onended = () => {
            stopScreenShare();
          };
        }

        setScreenSharing(true);
      } catch (err) {
        console.error("Screen share error:", err);
        const error = err as Error;
        if (error.name === 'NotAllowedError') {
          alert('Screen sharing permission was denied. Please allow screen sharing to continue.');
        } else if (error.name === 'NotFoundError') {
          alert('No screen available for sharing.');
        } else {
          alert('Error starting screen share. Please try again.');
        }
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (!screenStreamRef.current) return;

    // Stop all screen sharing tracks (video and audio)
    screenStreamRef.current.getTracks().forEach((track) => {
      track.stop();
      console.log(`Stopped ${track.kind} track for screen sharing`);
    });
    
    // Remove screen share audio tracks from peer connections
    Object.values(connections.current).forEach((pc) => {
      pc.getSenders().forEach((sender) => {
        if (sender.track && screenStreamRef.current?.getTracks().includes(sender.track)) {
          pc.removeTrack(sender);
        }
      });
    });
    
    screenStreamRef.current = null;

    if (window.localStream && videoEnabled) {
      // If video is enabled, switch back to camera with proper track replacement
      const cameraTrack = window.localStream.getVideoTracks()[0];
      if (cameraTrack) {
        Object.values(connections.current).forEach((pc) => {
          const videoSender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (videoSender) {
            videoSender.replaceTrack(cameraTrack).catch(console.error);
          }
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = window.localStream;
          localVideoRef.current.play().catch(console.error);
        }
      }
    } else {
      // If video is disabled, remove video track from peer connections
      Object.values(connections.current).forEach((pc) => {
        const videoSender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (videoSender) {
          pc.removeTrack(videoSender);
        }
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }

    setScreenSharing(false);
  };

  const endCall = () => {
    if (window.localStream) {
      window.localStream.getTracks().forEach((t) => t.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    Object.values(connections.current).forEach((pc) => pc.close());
    connections.current = {};
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    window.location.href = "/";
  };

  useEffect(() => {
    getPermissions();

    socketRef.current = io(SERVER_URL);

    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current?.id ?? null;
      socketRef.current?.emit("join-call", window.location.href, username); // ✅ send username to backend
    });

    socketRef.current.on("existing-users", (users: string[]) => {
      users.forEach((id) => {
        if (id !== socketIdRef.current) createPeerConnection(id, false);
      });
    });

    socketRef.current.on("user-joined", (id: string) => {
      if (id !== socketIdRef.current) createPeerConnection(id, true);
    });

    socketRef.current.on("signal", async (fromId: string, data: string) => {
      const signal = JSON.parse(data);
      const pc = connections.current[fromId];
      if (!pc) return;

      if (signal.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        if (signal.sdp.type === "offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketRef.current?.emit(
            "signal",
            fromId,
            JSON.stringify({ sdp: pc.localDescription })
          );
        }
      }

      if (signal.ice) {
        await pc.addIceCandidate(new RTCIceCandidate(signal.ice));
      }
    });

    socketRef.current.on("chat-message", (msg: string, sender: string) => {
      setMessages((prev) => [...prev, { sender, data: msg }]);
    });

    socketRef.current.on("user-left", (id: string) => {
      setVideos((prev) => prev.filter((v) => v.socketId !== id));
      if (connections.current[id]) connections.current[id].close();
      delete connections.current[id];
    });

    return () => {
      Object.values(connections.current).forEach((pc) => pc.close());
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [username]);

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Enhanced Ayurveda Pattern Background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-teal-50/20 to-green-100/25"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-gradient-to-l from-teal-300/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-green-300/15 to-emerald-300/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-tl from-teal-400/10 to-emerald-400/10 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>

      {/* Enhanced Header with Live Status */}
      <div className="relative z-10 bg-white/98 backdrop-blur-xl border-b border-emerald-200/60 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 to-teal-500/3"></div>
        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <VideocamIcon className="text-white text-xl drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full shadow-lg"></div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent tracking-tight">
                  ArogyaPath Live
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1.5 rounded-full border border-emerald-200/50">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-emerald-700 font-semibold text-sm tracking-wide">LIVE SESSION</span>
                  </div>
                  <span className="text-gray-600 text-sm font-medium">Holistic Health Consultation</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Status Dashboard */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Connection Quality */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2.5 rounded-2xl border border-green-200/50 shadow-sm">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div className="text-green-700">
                  <span className="font-bold text-sm">Excellent</span>
                  <div className="text-xs opacity-80">Connection</div>
                </div>
              </div>
              
              {/* Time Display */}
              <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 rounded-2xl border border-blue-200/50 shadow-sm">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div className="text-blue-700">
                  <span className="font-bold text-sm">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="text-xs opacity-80">Current Time</div>
                </div>
              </div>
              
              {/* Participants Count */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2.5 rounded-2xl border border-purple-200/50 shadow-sm">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <div className="text-purple-700">
                  <span className="font-bold text-sm">{videos.length + 1}</span>
                  <div className="text-xs opacity-80">Participants</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content - Fully Responsive */}
      <div className="relative z-10 flex flex-col xl:flex-row h-[calc(100vh-120px)] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 gap-4 lg:gap-6">
        
        {/* Video Section - Responsive Layout */}
        <div className="flex-1 order-1 xl:order-1 space-y-4">
          {/* Enhanced Main Video Display */}
          <div className="group bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/40 overflow-hidden transition-all duration-500 hover:shadow-emerald-500/10 hover:shadow-3xl hover:scale-[1.01]">
            {/* Premium Header with Glassmorphism */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <VideocamIcon className="text-white text-lg drop-shadow-sm" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl lg:text-2xl tracking-wide">Video Conference</h2>
                    <p className="text-white/80 text-sm">Professional Consultation Room</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <div className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-pulse shadow-sm"></div>
                    <span className="text-white font-semibold">HD Quality</span>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white font-semibold">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 space-y-4">
              {/* Enhanced Your Video - Smaller Size */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-200/50 bg-gray-900 transition-transform duration-300 group-hover:scale-[1.02]">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className={`w-full h-48 sm:h-56 lg:h-64 object-cover transition-opacity duration-300 bg-gray-800 rounded-2xl ${
                      videoEnabled ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoadedMetadata={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.play().catch(console.error);
                    }}
                    onCanPlay={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.play().catch(console.error);
                    }}
                  />
                  
                  {/* Video Off Overlay */}
                  {!videoEnabled && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <VideocamOffIcon className="text-gray-400 text-3xl" />
                        </div>
                        <p className="text-white font-medium text-lg mb-1">Camera Off</p>
                        <p className="text-gray-400 text-sm">Video is disabled</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Video Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* User Info Badge */}
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm block">{username}</span>
                        <span className="text-emerald-300 text-xs">Host</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${videoEnabled ? 'bg-green-500' : 'bg-red-500'}`}>
                      {videoEnabled ? (
                        <VideocamIcon className="text-white text-sm" />
                      ) : (
                        <VideocamOffIcon className="text-white text-sm" />
                      )}
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${audioEnabled ? 'bg-green-500' : 'bg-red-500'}`}>
                      {audioEnabled ? (
                        <MicIcon className="text-white text-sm" />
                      ) : (
                        <MicOffIcon className="text-white text-sm" />
                      )}
                    </div>
                  </div>

                  {/* Video Quality Indicator */}
                  {videoEnabled && (
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <span className="text-white text-xs font-medium">1080p</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Participant Videos - Always Show Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mr-3 animate-pulse"></div>
                    Participants ({videos.length})
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    <span>{videos.length > 0 ? 'All Connected' : 'Waiting for participants'}</span>
                  </div>
                </div>
                
                {/* Participant Videos Grid */}
                {videos.length > 0 ? (
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {videos.map((v, index) => (
                      <div key={v.socketId} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-teal-200/50 bg-gray-900 transition-transform duration-300 group-hover:scale-105">
                          <video
                            ref={(ref) => {
                              if (ref && v.stream) {
                                ref.srcObject = v.stream;
                                ref.play().catch(console.error);
                              }
                            }}
                            autoPlay
                            playsInline
                            className="w-full h-36 sm:h-40 object-cover bg-gray-800"
                            onLoadedMetadata={(e) => {
                              const video = e.target as HTMLVideoElement;
                              video.play().catch(console.error);
                            }}
                            onCanPlay={(e) => {
                              const video = e.target as HTMLVideoElement;
                              video.play().catch(console.error);
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                          
                          {/* Expert Info */}
                          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xl px-2 py-1 rounded-lg border border-white/20">
                            <div className="flex items-center space-x-1.5">
                              <div className="w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L15 13.74L16.18 20.02L10 16.77L3.82 20.02L5 13.74L0 9L6.91 8.26L10 2Z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-white text-xs font-medium block">Dr. Expert {index + 1}</span>
                                <span className="text-amber-300 text-xs">Practitioner</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Connection Status */}
                          <div className="absolute top-2 right-2 flex space-x-0.5">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-150"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium mb-1">Waiting for participants</p>
                    <p className="text-gray-500 text-sm">Experts will appear here when they join</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Section - Fully Responsive */}
        <div className="w-full xl:w-96 order-2 xl:order-2 flex flex-col min-h-[400px] xl:min-h-full">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-emerald-100/50 flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-3xl">
            
            {/* Enhanced Chat Header */}
            <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 px-6 py-5">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <svg className="w-6 h-6 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl tracking-wide">Live Chat</h3>
                    <p className="text-white/85 text-sm">Real-time consultation messages</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                    <div className="relative">
                      <div className="w-2.5 h-2.5 bg-emerald-300 rounded-full"></div>
                      <div className="absolute inset-0 bg-emerald-300 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-white font-semibold text-sm hidden sm:block">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50/50 to-emerald-50/30 min-h-0">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-gray-700 font-semibold text-lg mb-2">Welcome to ArogyaPath Live</h4>
                  <p className="text-gray-500 text-sm mb-4">Start your holistic health consultation by sharing your concerns...</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                      <div className={`max-w-[85%] sm:max-w-xs group ${msg.sender === username ? 'ml-4' : 'mr-4'}`}>
                        {msg.sender !== username && (
                          <div className="flex items-center space-x-2 mb-1 ml-1">
                            <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                              {msg.sender.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{msg.sender}</span>
                          </div>
                        )}
                        <div className={`px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 group-hover:shadow-xl ${
                          msg.sender === username
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-md'
                        }`}>
                          <div className="text-sm leading-relaxed">{msg.data}</div>
                        </div>
                        <div className={`mt-1 text-xs text-gray-400 ${msg.sender === username ? 'text-right mr-1' : 'text-left ml-1'}`}>
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <div className="flex items-center space-x-2 text-xs text-gray-400 bg-white/60 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Expert is typing...</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Enhanced Message Input */}
            <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
              <div className="space-y-3">
                {/* Quick Actions */}
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  <button className="flex-shrink-0 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200">
                    🌿 Symptoms
                  </button>
                  <button className="flex-shrink-0 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full text-xs font-medium hover:bg-teal-100 transition-colors border border-teal-200">
                    💊 Medication
                  </button>
                  <button className="flex-shrink-0 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-medium hover:bg-green-100 transition-colors border border-green-200">
                    🧘 Lifestyle
                  </button>
                </div>
                
                {/* Message Input Bar */}
                <div className="flex space-x-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Share your health concerns..."
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white/90 backdrop-blur-sm text-sm"
                    />
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                      title="Voice input"
                      aria-label="Voice input"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex-shrink-0 flex items-center space-x-2"
                  >
                    <span className="hidden sm:inline">Send</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Modern Floating Control Hub */}
      <div className="fixed bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-40 px-4 sm:px-0">
        {/* Premium Glassmorphism Container */}
        <div className="relative group">
          {/* Animated Background Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-all duration-500 animate-pulse"></div>
          
          {/* Main Control Panel */}
          <div className="relative bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/40 px-6 lg:px-10 py-4 lg:py-6 transition-all duration-500 hover:shadow-emerald-500/25 hover:bg-white/98">
            
            {/* Premium Controls Grid */}
            <div className="flex items-center justify-center space-x-3 lg:space-x-5">
              
              {/* Premium Video Control */}
              <div className="relative group/button">
                <button
                  onClick={toggleVideo}
                  className={`relative overflow-hidden p-4 lg:p-5 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-110 ${
                    videoEnabled
                      ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white'
                  }`}
                  aria-label={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/button:translate-x-[200%] transition-transform duration-1000"></div>
                  
                  {/* Icon with Animation */}
                  <div className="relative">
                    {videoEnabled ? (
                      <VideocamIcon className="text-xl lg:text-2xl drop-shadow-lg transition-transform duration-300 group-hover/button:scale-110" />
                    ) : (
                      <VideocamOffIcon className="text-xl lg:text-2xl drop-shadow-lg transition-transform duration-300 group-hover/button:scale-110" />
                    )}
                  </div>
                  
                  {/* Status Dot */}
                  <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-3 border-white shadow-lg ${
                    videoEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                  }`}></div>
                </button>
                
                {/* Premium Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 bg-black/90 backdrop-blur-sm text-white text-sm font-medium rounded-xl opacity-0 group-hover/button:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 shadow-2xl">
                  <div className="text-center">
                    <div className="font-bold">{videoEnabled ? 'Turn Off' : 'Turn On'}</div>
                    <div className="text-xs opacity-80">Camera</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black/90"></div>
                </div>
              </div>

              {/* Premium Microphone Control */}
              <div className="relative group/button">
                <button
                  onClick={toggleAudio}
                  className={`relative overflow-hidden p-4 lg:p-5 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-110 ${
                    audioEnabled
                      ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 text-white'
                      : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white'
                  }`}
                  aria-label={audioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/button:translate-x-[200%] transition-transform duration-1000"></div>
                  
                  {/* Icon with Animation */}
                  <div className="relative">
                    {audioEnabled ? (
                      <MicIcon className="text-xl lg:text-2xl drop-shadow-lg transition-transform duration-300 group-hover/button:scale-110" />
                    ) : (
                      <MicOffIcon className="text-xl lg:text-2xl drop-shadow-lg transition-transform duration-300 group-hover/button:scale-110" />
                    )}
                  </div>
                  
                  {/* Audio Level Bars */}
                  {audioEnabled && (
                    <div className="absolute -top-2 -right-2 flex space-x-0.5">
                      <div className="w-1 h-3 bg-green-300 rounded-full animate-pulse"></div>
                      <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-3 bg-green-300 rounded-full animate-pulse delay-150"></div>
                    </div>
                  )}
                  
                  {/* Status Dot */}
                  <div className={`absolute -top-2 ${audioEnabled ? '-left-2' : '-right-2'} w-4 h-4 rounded-full border-3 border-white shadow-lg ${
                    audioEnabled ? 'bg-blue-400 animate-pulse' : 'bg-red-500'
                  }`}></div>
                </button>
                
                {/* Premium Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 bg-black/90 backdrop-blur-sm text-white text-sm font-medium rounded-xl opacity-0 group-hover/button:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 shadow-2xl">
                  <div className="text-center">
                    <div className="font-bold">{audioEnabled ? 'Mute' : 'Unmute'}</div>
                    <div className="text-xs opacity-80">Microphone</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black/90"></div>
                </div>
              </div>

              {/* Screen Share Control */}
              <div className="relative group/button">
                <button
                  onClick={toggleScreenShare}
                  className={`relative overflow-hidden p-4 lg:p-5 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-110 ${
                    screenSharing
                      ? 'bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-slate-600 via-gray-600 to-slate-700 text-white'
                  }`}
                  aria-label={screenSharing ? 'Stop Screen Share' : 'Share Screen'}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/button:translate-x-[200%] transition-transform duration-1000"></div>
                  
                  {/* Icon with Animation */}
                  <div className="relative">
                    {screenSharing ? (
                      <StopScreenShareIcon className="text-xl lg:text-2xl drop-shadow-lg transition-transform duration-300 group-hover/button:scale-110" />
                    ) : (
                      <ScreenShareIcon className="text-xl lg:text-2xl drop-shadow-lg transition-transform duration-300 group-hover/button:scale-110" />
                    )}
                  </div>
                  
                  {/* Status Indicator */}
                  {screenSharing && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-ping border-2 border-white"></div>
                  )}
                  
                  {/* Status Dot */}
                  <div className={`absolute -top-2 -left-2 w-4 h-4 rounded-full border-3 border-white shadow-lg ${
                    screenSharing ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                </button>
                
                {/* Premium Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 bg-black/90 backdrop-blur-sm text-white text-sm font-medium rounded-xl opacity-0 group-hover/button:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 shadow-2xl">
                  <div className="text-center">
                    <div className="font-bold">{screenSharing ? 'Stop' : 'Share'}</div>
                    <div className="text-xs opacity-80">Screen</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black/90"></div>
                </div>
              </div>

              {/* Elegant Separator */}
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-emerald-300/50 to-transparent mx-2"></div>

              {/* End Call Control */}
              <div className="relative group/button">
                <button
                  onClick={endCall}
                  className="relative overflow-hidden p-4 lg:p-5 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-110 ring-2 ring-red-200 hover:ring-red-300"
                  aria-label="End Call"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/button:translate-x-[200%] transition-transform duration-1000"></div>
                  
                  {/* Icon with Animation */}
                  <div className="relative">
                    <CallEndIcon className="text-xl lg:text-2xl drop-shadow-lg transition-transform duration-300 group-hover/button:scale-110" />
                  </div>
                  
                  {/* Pulsing Ring */}
                  <div className="absolute inset-0 border-2 border-red-300 rounded-2xl animate-pulse"></div>
                </button>
                
                {/* Premium Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 bg-red-600 backdrop-blur-sm text-white text-sm font-medium rounded-xl opacity-0 group-hover/button:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 shadow-2xl">
                  <div className="text-center">
                    <div className="font-bold">End Call</div>
                    <div className="text-xs opacity-80">Leave Session</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-600"></div>
                </div>
              </div>
            </div>
            
            {/* Session Info Bar */}
            <div className="hidden sm:flex items-center justify-center mt-4 pt-4 border-t border-emerald-200/30 space-x-6 text-xs">
              <div className="flex items-center space-x-2 text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Secure Connection</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Session: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">HD Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
