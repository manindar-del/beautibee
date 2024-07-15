import ChatAvatar from "@/ui/Avatar/ChatAvatar";
import React from "react";
import styles from "@/styles/pages/chat.module.scss";
import assest from "@/json/assest";
import Image from "next/image";
import { Button, Stack } from "@mui/material";
import { Cookies } from "react-cookie";
import moment from "moment";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { handleDownload, getChatTime, getChatDate, getChatIndDate } from "@/api/functions/Chat_function";
import { useSelector } from "react-redux";

const ChatMessageDetailsRight = ({ message }) => {
  const cookies = new Cookies();
  const { getProfileData } = useSelector((store) => store.profile);

  return (
    <div className={styles.message_right_wrapper_box}>
      <div className={styles.message_right_wrapper}>
        <div className={styles.message_right_wrapper_txt}>
          {!!message?.text && (
            <div className={styles.message_right_wrapper_message}>
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
                    <Image src={assest.iconFile} alt="" width={20} height={20} />
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
          <div className={styles.message_right_wrapper_nameTime}>
            <h5>
              {getProfileData?.first_name}
              <span>{`${getChatIndDate(
                moment(message?.createdAt).format("YYYY-MM-DD")
              )}, ${getChatTime(message?.createdAt)}`}</span>
            </h5>
          </div>
        </div>

        <div className={styles.message_right_wrapper_img}>
          <ChatAvatar
            size={44}
            image={
              !!getProfileData?.profile_image
                ? `${mediaPath}/uploads/user/profile_pic/${getProfileData?.profile_image}`
                : assest.no_user
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessageDetailsRight;
