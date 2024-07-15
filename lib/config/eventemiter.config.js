import EventEmitter from "eventemitter3";

export const eventEmitter = new EventEmitter();

export const events = {
  sendMessage: "send_message",
  rcvMessage: "chatlist",
  typeResp: "typingResponse",
  type: "typing",
  users: "guest_list",
  sendParam: "guest_list_initialize",
  sendPramChatHeader: "message_user_details",
  chatdetailHeader: "user_details",
  rcvMessageParam: "details_message",
  seenMsg: "is_seen",
};
