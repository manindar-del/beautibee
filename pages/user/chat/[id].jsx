import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/pages/chat.module.scss";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import assest from "@/json/assest";
import ChatMesageCard from "@/components/chatModule/ChatMesageCard";
import ChatMessageHeader from "@/components/chatModule/CharMessageHeader";
import ChatDeatilsBody from "@/components/chatModule/ChatDeatilsBody";
import ChatMessage from "@/components/chatModule/ChatMessage";
import ChatJoinedConversion from "@/components/chatModule/ChatJoinedConversion";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import ChatWrapper from "@/components/chatModule/ChatWrapper";
import { socketInstance } from "@/lib/config/socket.config";
import { events } from "@/lib/config/eventemiter.config";
import { Cookies } from "react-cookie";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSnackbar } from "notistack";
import ChatMessageDate from "@/components/chatModule/ChatMessageDate";
import moment from "moment";
import { getChatDate } from "@/api/functions/Chat_function";
const message = [
  {
    name: "Test",
    message: "message",
    date: "12.3.2022",
  },
  {
    name: "Test",
    message: "message",
    date: "12.3.2022",
  },
  {
    name: "Test",
    message: "message",
    date: "12.3.2022",
  },
  {
    name: "Test",
    message: "message",
    date: "12.3.2022",
  },
  {
    name: "Test",
    message: "message",
    date: "12.3.2022",
  },
  {
    name: "Test",
    message: "message",
    date: "12.3.2022",
  },
  {
    name: "Test",
    message: "message",
    date: "12.3.2022",
  },
  {
    name: "Test",
    message: "message",
    date: "12.3.2022",
  },
  {
    name: "Test",
    message: "message",
    date: "12.3.2022",
  },
];

function index() {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const lastMessageRef = useRef();
  const socket = socketInstance;
  const [currPage, setCurrPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [perPage, setPerPage] = useState(6);
  const cookies = new Cookies();
  const router = useRouter();
  const { ref, inView } = useInView();
  const { enqueueSnackbar } = useSnackbar();
  let userDetails = cookies.get("userDetails");

  const fetchData = async (currPage) => {
    setMessages([]);
    socket.emit(
      events?.rcvMessageParam,
      {
        header: {
          token: cookies.get("token"),
          userid: router.query.id,
          page: 1,
          per_page: perPage * currPage,
        },
      },
      (response) => {}
    );
  };

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, router.query.id]);

  useEffect(() => {
    socket.on(events?.typeResp, (data) => setTypingStatus(data));
  }, [socket]);

  useEffect(() => {
    if (hasMore) {
      fetchData(currPage);
    }
    socket.on(events?.rcvMessage, (data) => {
      if ((perPage * currPage) === data?.total) {
        setHasMore(false);
      }
       console.log(data?.message_list, "messages");
      setMessages(data?.message_list?.docs);
    });
  }, [socket, currPage, hasMore, router.query.id]);

  useEffect(() => {
    if (inView) {
      // setCurrPage(currPage + 1);
      // if (currPage !== 0 && hasMore) {
      //   enqueueSnackbar("loading..", { variant: "info" });
      // }
    }
  }, [inView]);

  // useEffect(() => {
  //   setCurrPage(1);
  //   setMessages([]);
  //   setHasMore(true);
  //   // alert("hi")
  // }, [router.query.id]);

  return (
    <DashboardWrapper headerType="search" page="user" hasFooter={false}>
      <div className={styles.chat_wrapper_main}>
        <ChatWrapper>
          <div className={styles.chat_wrapper}>
            <div className={styles.chat_left_panel}>
              <div className={styles.chatMessageHeader}>
                <ChatMessageHeader
                  setSearchVal={setSearchVal}
                  searchVal={searchVal}
                />
              </div>
              <div className={styles.message_profile}>
                <ChatMesageCard socket={socketInstance} searchVal={searchVal} />
              </div>
            </div>

            <div className={styles.chat_right_panel}>
              <ChatDeatilsBody
                socket={socketInstance}
                typingStatus={typingStatus}
              >
                <Grid>
                  <InfiniteScroll
                    //dataLength={message?.length}
                    // next={loadMoreData}
                    hasMore={hasMore}
                    // loader={<CircularProgress />}
                    className={styles.InfiniteScroll}
                    scrollThreshold={0}
                  >
                    <Box ref={ref} />
                    {messages?.map((_message, index) => (
                      <>
                        {" "}
                        {console.log(_message,"test")}
                        <ChatMessageDate info={getChatDate(_message?._id)} />
                        <div className={styles.chat_box_sec}>
                          {_message?.message_arr?.length &&
                            _message?.message_arr?.map((_msg, i) => (
                              <ChatMessage
                                direction={
                                  _msg?.sender_id == userDetails?.data?._id
                                    ? "right"
                                    : "left"
                                }
                                message={_msg}
                                socket={socket}
                              />
                            ))}
                        </div>
                      </>
                    ))}
                    <Box ref={lastMessageRef} />
                  </InfiniteScroll>

                  {/* <div className={styles.message_conversation}>
                    <ChatJoinedConversion username="mathew john" />
                  </div> */}
                </Grid>
              </ChatDeatilsBody>
            </div>
          </div>
        </ChatWrapper>
      </div>
    </DashboardWrapper>
  );
}

export default index;
