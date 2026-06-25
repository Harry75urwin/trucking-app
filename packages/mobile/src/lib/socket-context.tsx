import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

function getSocket(token?: string | null) {
  return io(`${SOCKET_URL}/messaging`, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    autoConnect: token != null && token.length > 0,
    auth: token ? { token: `Bearer ${token}` } : undefined,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
  });
}

export function SocketProvider({
  children,
  token,
}: {
  children: ReactNode;
  token?: string | null;
}) {
  const [socket, setSocket] = useState<Socket | null>(() =>
    token ? getSocket(token) : null
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onConnectError = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [socket]);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    if (socket) {
      socket.auth = { token: `Bearer ${token}` };
      socket.connect();
      return;
    }

    const next = getSocket(token);
    setSocket(next);
  }, [token, socket]);

  const connect = useCallback(() => {
    socket?.connect();
  }, [socket]);

  const disconnect = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      connect,
      disconnect,
    }),
    [socket, isConnected, connect, disconnect]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}
