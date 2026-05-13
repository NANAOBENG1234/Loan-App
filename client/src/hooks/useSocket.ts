"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/utils/constants";

export function useSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [token]);

  return socketRef;
}
