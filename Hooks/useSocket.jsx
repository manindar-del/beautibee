import { socketUrl } from "@/api/Endpoints/apiEndPoints";
import { events } from "@/lib/config/eventemiter.config";
import { socketInstance } from "@/lib/config/socket.config";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
const cookies = new Cookies();

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socketInstance.connected);
  const [lastPing, setLastPing] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const params = useRouter();
  const sendPing = () => {
    socketInstance.emit("ping");
  };

  const sokcetReconnect = () => {
    socketInstance.on("reconnect", () => {
      //Your Code Here
    });
  };

  useEffect(() => {
    socketInstance.on("connect", (socket) => {
      setIsConnected(true);
      // socketInstance.on(events?.type, (data) =>
      //   socket.broadcast.emit(events?.typeResp, data)
      // );
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("pong", () => {
      setLastPing(new Date().toISOString());
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("pong");
    };
  }, []);

  useEffect(() => {
    // enqueueSnackbar(isConnected ? "Connected" : "Not connected", {
    //   variant: isConnected ? "success" : "error",
    // });
    socketInstance.emit("active", {
      header: {
        // roomid: cookies.get("room_id"),
        token: cookies.get("token"),
      },
    });
  }, [isConnected]);

  return { isConnected, lastPing };
};

export default useSocket;
