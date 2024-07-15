import ChatAvatar from "@/ui/Avatar/ChatAvatar";
import React, { useEffect } from "react";
import styles from "@/styles/pages/chat.module.scss";
import assest from "@/json/assest";
import Image from "next/image";
import { Button } from "@mui/material";
import moment from "moment";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import {
  getChatDate,
  getChatIndDate,
  getChatTime,
  handleDownload,
} from "@/api/functions/Chat_function";
import { useInView } from "react-intersection-observer";
import { useSnackbar } from "notistack";
import { events } from "@/lib/config/eventemiter.config";
import { Cookies } from "react-cookie";
import { socketInstance } from "@/lib/config/socket.config";
import { useDispatch, useSelector } from "react-redux";

const ChatMessageDetailsLeft = ({ message, socket }) => {
  const { ref, inView } = useInView();
  const { enqueueSnackbar } = useSnackbar();
  const cookies = new Cookies();
  const { page, per_page, searchusername } = useSelector((s) => s.global);

  const fetchSeenData = () => {
    socket.emit(
      events?.seenMsg,
      {
        header: {
          token: cookies.get("token"),
          page: page,
          perpage: per_page,
          searchusername: searchusername,
        },
        chatid: message?._id,
      },
      (response) => {}
    );
  };
  useEffect(() => {
    if (inView) {
      if (message?.is_seen == false) {
        fetchSeenData();
      }
    }
  }, [inView]);
  return (
    <div className={styles.message_left_wrapper_box} ref={ref}>
      <div className={styles.message_left_wrapper}>
        <div className={styles.message_left_wrapper_img}>
          <ChatAvatar
            size={44}
            variant={
              message?.guestUserDetails?.chat_status == "Active" ? "dot" : ""
            }
            image={
              !!message?.guestUserDetails?.profile_image
                ? `${mediaPath}/uploads/user/profile_pic/${message?.guestUserDetails?.profile_image}`
                : assest.no_user
            }
          />
        </div>
        <div className={styles.message_left_wrapper_txt}>
          {!!message?.text && (
            <div className={styles.message_left_wrapper_message}>
              <p>{message?.text}</p>
            </div>
          )}
          {message?.image_file?.length > 0 &&
            message?.image_file.map((_img, i) => (
              <div className={styles.message_image}>
                <Image
                  src={`${mediaPath}/uploads/chat/image_file/${_img}`}
                  width={500}
                  height={400}
                  alt=""
                />
              </div>
            ))}
          {message?.doc_file?.length > 0 &&
            message?.doc_file.map((_file, i) => (
              <div className={styles.message_file}>
                <div className={styles.file_text}>
                  <figure>
                    <Image
                      src={assest.iconFile}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </figure>
                  <h5>{_file?.split(".")[0]}</h5>
                </div>
                <Button
                  onClick={() =>
                    handleDownload(
                      `${mediaPath}/uploads/chat/doc_file/${_file}`,
                      _file
                    )
                  }
                >
                  <Image
                    src={assest.iconDownload}
                    alt=""
                    width={20}
                    height={20}
                  />{" "}
                  Download
                </Button>
              </div>
            ))}

          <div className={styles.message_left_wrapper_nameTime}>
            <h5>
              {message?.guestUserDetails?.full_name}
              <span>{`${getChatIndDate(
                moment(message?.createdAt).format("YYYY-MM-DD")
              )}, ${getChatTime(message?.createdAt)}`}</span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageDetailsLeft;
