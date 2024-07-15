import ChatAvatar from "@/ui/Avatar/ChatAvatar";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/chat.module.scss";
import assest from "@/json/assest";
import Image from "next/image";
import { Button } from "@mui/material";
import { events } from "@/lib/config/eventemiter.config";
import { useRouter } from "next/router";
import { Cookies } from "react-cookie";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { getChatTime } from "@/api/functions/Chat_function";

const ChatDetailsHeader = ({ socket }) => {
  const [user, setUser] = useState({});
  const router = useRouter();
  const cookies = new Cookies();

  useEffect(() => {
    setUser({});
    const fetchData = async () => {
      socket.emit(
        events?.sendPramChatHeader,
        {
          header: {
            token: cookies.get("token"),
            userid: router.query.id,
          },
        },
        (response) => {}
      );
    };

    fetchData();

    socket.on(events?.chatdetailHeader, (data) => {
      setUser(data?.user_details[0]);
    });
  }, [socket, router.query.id]);


  return (
    <div>
      <div className={styles.right_chat_header}>
        <div className={styles.right_chat_header_profile}>
          <div className={styles.right_chat_header_profile_img}>
            <ChatAvatar
              size={52}
              variant={user?.chat_status == "Active" ? "dot" : ""}
              image={
                !!user?.profile_image
                  ? `${mediaPath}/uploads/user/profile_pic/${user?.profile_image}`
                  : assest.no_user
              }
            />
          </div>

          <div className={styles.right_chat_header_profile_text}>
            <h4>{user?.full_name}</h4>
            <p>
              {user?.chat_status == "Active"?"Just Now":!!user?.guestUserChat ? getChatTime(user?.guestUserChat?.createdAt) : null}
            </p>
          </div>
        </div>

        {/* <div className={styles.right_chat_header_search}>
              <Button><Image src={assest.searchiconwhite} width={19} height={19}/></Button>
          </div> */}
      </div>
    </div>
  );
};

export default ChatDetailsHeader;
