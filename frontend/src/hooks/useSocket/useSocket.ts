// hooks/useSocket.ts
import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const useSocket = (chatId: string, currUser: any) => {
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Setup socket connection when currUser becomes available
  useEffect(() => {
    if (!chatId || !currUser) return;

    socketRef.current = io(ENDPOINT);

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });

    socketRef.current.emit("setup", currUser);
    socketRef.current.emit("join chat", chatId);

    return () => {
      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [chatId, currUser]); // Now this will rerun once currUser is set

  const onNewMessage = (callback: (message: any) => void) => {
    if (!socketRef.current) return () => {};
    socketRef.current.on("newMessage", callback);
    return () => {
      socketRef.current?.off("newMessage", callback);
    };
  };

  const sendMessage = useCallback(
    (message: string) => {
      if (socketRef.current && chatId) {
        socketRef.current.emit("chatMessage", { message, chatId }); // ✅ correct format
      } else {
        console.warn("Socket not connected or chatId missing");
      }
    },
    [chatId]
  );

  return {
    socket: socketRef.current,
    socketConnected,
    onNewMessage,
    sendMessage,
  };
};

export default useSocket;
