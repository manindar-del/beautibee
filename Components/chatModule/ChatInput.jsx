import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/pages/chat.module.scss";
import assest from "@/json/assest";
import Image from "next/image";
import { Button, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { events } from "@/lib/config/eventemiter.config";
import { useSnackbar } from "notistack";
import { Cookies } from "react-cookie";
import { useSelector } from "react-redux";

const ChatInput = ({ socket }) => {
  const router = useRouter();
  const cookies = new Cookies();
  const { enqueueSnackbar } = useSnackbar();
  const [fileData, setFileData] = useState([]);
  const [fileType, setFileType] = useState([]);
  const [fileName, setFileName] = useState([]);
  const [message, setMessage] = useState("");
  const receiver_id = router?.asPath.split("/")[3];
  const { page, per_page, chat_per_page } = useSelector((s) => s.global);
  const { getProfileData } = useSelector((store) => store.profile);
  const [uID, setuID] = useState(1);

  const handleFileInput = (files) => {
    setuID((old) => old + 1);
    const uploaded = [...fileData];
    const uploadedType = [...fileType];
    const uploadedName = [...fileName];
    Array.from(files).some((file) => {
      uploaded.push(file);
      uploadedType.push(file?.type.split("/")[1]);
      uploadedName.push(file?.name);
    });
    setFileData(uploaded);
    setFileType(uploadedType);
    setFileName(uploadedName);
  };
  /**
   * This function removes a file from an array of uploaded files.
   */
  const removeFile = (file) => {
    const uploaded = [...fileData];
    const uploadedType = [...fileType];
    const uploadedName = [...fileName];
    var index = uploaded.indexOf(file);
    if (index !== -1) {
      uploaded.splice(index, 1);
      setFileData(uploaded);
    }
    var iType = uploadedType.indexOf(file?.type.split("/")[1]);
    if (iType !== -1) {
      uploadedType.splice(iType, 1);
      setFileType(uploadedType);
    }

    var iName = uploadedName.indexOf(file?.name);
    if (iName !== -1) {
      uploadedName.splice(iName, 1);
      setFileName(uploadedName);
    }
  };
  /**
   * The function emits a socket event indicating that a user is typing.
   */

  const handleTyping = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }

    socket.emit(events?.type, {
      header: {
        token: cookies.get("token"),
        receiver_id: router.query.id,
      },
      msg: `${getProfileData?.full_name} is typing`,
      is_typing_status: true,
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      socket.emit(events?.type, {
        header: {
          token: cookies.get("token"),
          receiver_id: router.query.id,
        },
        msg: "",
        is_typing_status: false,
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [message]);

  /**
   * This function sends a message with optional image file to a socket server, with error handling for
   * empty messages.
   */
  const handleSendMessage = async () => {
    if (message == "" && fileData?.length == 0) {
      enqueueSnackbar("Please type something..", {
        variant: "error",
      });
    } else {
      fetchData();
    }
  };
  const fetchData = async () => {
    socket.emit(events?.sendMessage, {
      header: {
        token: cookies.get("token"),
      },
      text: message,
      receiver_id: router.query.id,
      sender_id: getProfileData?._id,
      image_file: fileData,
      fileType: fileType,
      fileName: fileName,
      page: page,
      per_page: per_page,
      chat_per_page: chat_per_page,
    });
    setMessage("");
    setFileData([]);
    setFileType([]);
    setFileName([]);
  };

  return (
    <div className={styles.chat_sec}>
      <div
        className={`${styles.message_input_wrapper} ${
          fileData?.length > 0 && styles.fileSecShow
        }`}
      >
        {fileData?.length > 0 && (
          <div className={styles.show_file}>
            {fileData?.length > 0 &&
              fileData.map((file, i) => {
                return file.type.split("/")[0] === "image" ? (
                  <div className={styles.show_file_image}>
                    <Image
                      src={URL.createObjectURL(file)}
                      alt=""
                      width={100}
                      height={100}
                    />
                    <button
                      className={styles.close_btn}
                      onClick={(i) => removeFile(file)}
                    >
                      <Image
                        src={assest.close_btn}
                        alt=""
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                ) : (
                  <div className={styles.show_file_docu}>
                    <div className={styles.message_file}>
                      <figure>
                        <Image
                          src={assest.iconFile}
                          alt=""
                          width={20}
                          height={20}
                        />
                      </figure>
                      <div className={styles.file_text}>
                        <h5>{file?.name}</h5>
                      </div>
                      <button
                        className={styles.close_btn}
                        onClick={(i) => removeFile(file)}
                      >
                        <Image
                          src={assest.close_btn}
                          alt=""
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <input
          type="text"
          placeholder="Type here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <Stack className={styles.chatMediaRight} direction="row">
          <div className={styles.input_file_section}>
            <div className={styles.input_file}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInput(e.target.files)}
                multiple
                key={uID}
              />
              <div className={styles.input_file_img}>
                <Image src={assest.plusicon} width={18} height={18} />
              </div>
            </div>
            <div className={styles.input_file}>
              {/* <input
                type="file"
                accept=".xlsx,.xls,.doc,.docx,.ppt, .pptx,.txt,.pdf"
                onChange={(e) => handleFileInput(e.target.files)}
                multiple
                key={uID}
              />
              <div className={styles.input_file_img}>
                <Image src={assest.attachicon} width={18} height={18} />
              </div> */}
            </div>
          </div>
          <Button onClick={handleSendMessage}>
            <Image src={assest.sendicon} width={22} height={22} />
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default ChatInput;
