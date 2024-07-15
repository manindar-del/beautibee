import useSocket from "@/hooks/useSocket";
import React from "react";

const ChatWrapper = ({ children }) => {
  //establish initial socket connection
  const { isConnected, lastPing }=useSocket()

  //check connection

  return <div>{children}</div>;
};

export default ChatWrapper;
