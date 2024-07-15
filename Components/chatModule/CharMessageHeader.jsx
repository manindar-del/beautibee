import assest from "@/json/assest";
import ChatAvatar from "@/ui/Avatar/ChatAvatar";
import React from "react";
import styles from "@/styles/pages/chat.module.scss";
import { Cookies } from "react-cookie";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { useSelector } from "react-redux";

const CharMessageHeader = ({ searchVal, setSearchVal }) => {
  const cookie = new Cookies();
  const { getProfileData } = useSelector((store) => store.profile);

  return (
    <div>
      <div className={styles.left_chat_profile}>
        <div className={styles.chat_header_profile}>
          <div className={styles.chat_header_profile_img}>
            <ChatAvatar
              size={60}
              variant="default"
              image={
                !!getProfileData?.profile_image
                  ? `${mediaPath}/uploads/user/profile_pic/${getProfileData?.profile_image}`
                  : assest.no_user
              }
              alt={getProfileData?.full_name}
            />
          </div>

          <div className={styles.chat_header_profile_txt}>
            <h4>{getProfileData?.full_name}</h4>
            {/* <p>Lorem Ipsum</p> */}
          </div>
        </div>

        <div className={styles.left_chat_search}>
          <input
            type="search"
            placeholder="Search"
            onChange={(e) => setSearchVal(e.target.value)}
            value={searchVal}
          />
        </div>

        <h4>Messaging</h4>
      </div>
    </div>
  );
};

export default CharMessageHeader;
