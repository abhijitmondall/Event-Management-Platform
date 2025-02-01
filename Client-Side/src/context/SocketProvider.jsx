import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { BASE_URL } from "../helpers/settings";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

function SocketProvider({ children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io(`${BASE_URL}`, {
      path: "/socket",
      reconnection: true,
      transports: ["polling", "websocket"],
      reconnectionAttempts: 10,
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const info = {
    socket,
  };
  return (
    <SocketContext.Provider value={info}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
