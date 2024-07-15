import ChatAvatar from "@/ui/Avatar/ChatAvatar";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/pages/chat.module.scss";
import assest from "@/json/assest";
import { useRouter } from "next/router";
import { events } from "@/lib/config/eventemiter.config";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { Cookies } from "react-cookie";
import {
  useUserListData,
  useUserListParam,
} from "@/hooks/chatHook/useUserList";
import { getChatTime } from "@/api/functions/Chat_function";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setPerPage, setSearchVal } from "@/reduxtoolkit/global.slice";
import { Alert, AlertTitle, Badge, Stack } from "@mui/material";

const ChatMesageCard = ({ socket, searchVal }) => {
  const router = useRouter();
  const router_id = router?.asPath.split("/")[3];
  const cookies = new Cookies();
  const [users, setUsers] = useState([]);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();

  const gotoChat = (user) => {
    router.push(`/chat/${user?.user_id}`);
  };
  /**
   * This function fetches data from a server using a socket connection and updates the state of users
   * with the received data.
   */
  const fetchData = async (currPage) => {
    const param = {
      token: cookies.get("token"),
      page: currPage,
      per_page: 10,
      searchusername: searchVal,
    };
    dispatch(setPage(currPage));
    dispatch(setPerPage(10));
    dispatch(setSearchVal(searchVal));
    useUserListParam(events?.sendParam, param);
  };

  /**
   * This function checks if the user has scrolled to the bottom of a list and updates the current page
   * accordingly.
   */
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage(currPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [users]);

  useEffect(() => {
    if (hasMore) {
      fetchData(currPage);
      socket.on(events?.users, (data) => {
        if (currPage === data?.pages) {
          setHasMore(false);
        }
        setUsers([...users, ...data?.guest_list]);
      });
    }
  }, [socket, currPage, hasMore]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(currPage);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal]);

  return (
    <div className={styles.chat_list} onScroll={onScroll} ref={listInnerRef}>
      {users?.length > 0 ? (
        users?.map((user, index) => (
          <div
            className={`${styles.chat_listing_profile} ${
              router_id == user?.user_id && styles.active
            }`}
            onClick={() => gotoChat(user)}
            style={{ cursor: "pointer" }}
            key={index}
          >
            <div className={styles.chat_listing_profile_details}>
              <div className={styles.chat_listing_img}>
                <ChatAvatar
                  size={40}
                  variant={user?.status == "Active" ? "dot" : ""}
                  image={
                    !!user?.user_image
                      ? `${mediaPath}/uploads/user/profile_pic/${user?.user_image}`
                      : assest.no_user
                  }
                />
              </div>
              <div className={styles.chat_listing_text}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <h5>{user?.user_name} </h5>
                  <Badge
                    color="warning"
                    badgeContent={
                      !!user?.unreed_count ? user?.unreed_count : 0
                    }
                  />
                </Stack>

                <p>{user?.text}</p>
              </div>
            </div>
            <div className={styles.chat_listing_time}>
              <p>{getChatTime(user?.createdAt)}</p>
            </div>
          </div>
        ))
      ) : (
        <>
          <Alert severity="warning">
            <AlertTitle>Nothing to see here</AlertTitle>
            Start a new conversation.Your chat will show here
          </Alert>
        </>
      )}
    </div>
  );
};

export default ChatMesageCard;
