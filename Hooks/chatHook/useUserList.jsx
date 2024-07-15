import { socketInstance } from "@/lib/config/socket.config";

export const useUserListParam = (eventName, headerParam) => {
  let _res = socketInstance.emit(
    eventName,
    {
      header: headerParam,
    },
    (response) => {}
  );
  return _res;
};

export const useUserListData = (eventName) => {
  let _res = socketInstance.on(eventName, (data) => {
    return data;
  });
  return _res;
};
