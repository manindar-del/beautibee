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
import { useDispatch, useSelector } from "react-redux";
import { setChatPage } from "@/reduxtoolkit/global.slice";

export async function getServerSideProps({ query }) {
  return { props: { routeId: query?.id } };
}
function index({ routeId }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const lastMessageRef = useRef();
  const socket = socketInstance;
  const [currPage, setCurrPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const [perPage, setPerPage] = useState(6);

  const cookies = new Cookies();

  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  const { enqueueSnackbar } = useSnackbar();
  const { getProfileData } = useSelector((store) => store.profile);
  const [routerId, setRouterId] = useState(null);
  console.log(socket, "routerId");

  const fetchData = (currPage) => {
    setMessages([]);
    dispatch(setChatPage(perPage * currPage));
    socket.emit(
      events?.rcvMessageParam,
      {
        header: {
          token: cookies.get("token"),
          userid: routeId,
          page: currPage,
          per_page: perPage * currPage,
          chat_per_page: perPage * currPage,
        },
      },
      (response) => {}
    );
  };

  socket.on(events?.rcvMessage, (data) => {
    if (data?.total <= perPage * currPage) {
      setHasMore(false);
    }
    if (data?.receiver_id === routeId) {
      setMessages(data?.message_list);
    }
  });

  socket.on(events?.typeResp, (data) => {
    if (data?.sender_id === routeId) {
      setTypingStatus(data?.msg);
      setIsTyping(data?.is_typing_status);
    }
  });

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, routeId]);

  useEffect(() => {
    if (hasMore) {
      fetchData(currPage);
    }
  }, [socket, currPage, hasMore, routeId]);

  useEffect(() => {
    if (inView) {
      if (hasMore) {
        // enqueueSnackbar("loading..", { variant: "info" });
        setCurrPage(currPage + 1);
      }
    }
  }, [inView]);

  useEffect(() => {
    setHasMore(true);
    setRouterId(routeId);
  }, [routeId]);

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
                page={currPage}
                per_page={perPage * currPage}
                chat_per_page={perPage * currPage}
                isTyping={isTyping}
              >
                <Grid>
                  <InfiniteScroll
                    dataLength={messages?.length}
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
                        <ChatMessageDate info={getChatDate(_message?._id)} />
                        <div className={styles.chat_box_sec}>
                          {_message?.message_arr?.length &&
                            _message?.message_arr?.map((_msg, i) => (
                              <ChatMessage
                                direction={
                                  _msg?.sender_id == getProfileData?._id
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
                    <Box style={{ height: "60px" }} ref={lastMessageRef} />
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
