import { socketUrl } from "@/api/Endpoints/apiEndPoints";
import io from "socket.io-client";
export const socketInstance = io(socketUrl);

export const disconectFromConnection=()=>{
    socketInstance.disconnect()
}
