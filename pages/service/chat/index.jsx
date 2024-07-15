import DashboardWrapper from '@/layout/Wrappers/DashboardWrapper';
import styles from "@/styles/pages/chat.module.scss";
import React from 'react';
import Image from "next/image";
import assest from "@/json/assest";
import ChatMesageCard from '@/components/chatModule/ChatMesageCard';
import ChatMessageHeader from '@/components/chatModule/CharMessageHeader';
import ChatDeatilsBody from '@/components/chatModule/ChatDeatilsBody';
import ChatMessage from '@/components/chatModule/ChatMessage';
import ChatJoinedConversion from '@/components/chatModule/ChatJoinedConversion';
import { Container, Grid } from '@mui/material';

const message=[{
    name:"Test",
    message:"message",
    date:"12.3.2022"
},{
    name:"Test",
    message:"message",
    date:"12.3.2022"
},{
    name:"Test",
    message:"message",
    date:"12.3.2022"
},{
    name:"Test",
    message:"message",
    date:"12.3.2022"
},{
    name:"Test",
    message:"message",
    date:"12.3.2022"
},{
    name:"Test",
    message:"message",
    date:"12.3.2022"
},{
    name:"Test",
    message:"message",
    date:"12.3.2022"
},{
    name:"Test",
    message:"message",
    date:"12.3.2022"
},{
    name:"Test",
    message:"message",
    date:"12.3.2022"
},]

function index() {
  return (
    <DashboardWrapper headerType="search" page="service">
      <div className={styles.chat_wrapper_main}>
        <Container>
          <div className={styles.chat_wrapper}>
            <div className={styles.chat_left_panel}>
              <div className={styles.chatMessageHeader}>
                {/* <ChatMessageHeader /> */}
              </div>
              <div className={styles.message_profile}>
                {/* <ChatMesageCard />
                <ChatMesageCard />
                <ChatMesageCard />
                <ChatMesageCard />
                <ChatMesageCard />
                <ChatMesageCard />
                <ChatMesageCard />
                <ChatMesageCard />
                <ChatMesageCard /> */}
              </div>
            </div>

            <div className={styles.chat_right_panel}>
              {/* <ChatDeatilsBody>
                <Grid>
                  {message?.map((_message, index) => (
                    <ChatMessage
                      direction={index % 2 === 0 ? "left" : "right"}
                      message={_message}
                    />
                  ))}
                  <div className={styles.message_conversation}>
                    <div className={styles.cont_box}>
                      <ChatJoinedConversion username="mathew john" />
                    </div>
                  </div>
                </Grid>
              </ChatDeatilsBody> */}
            </div>
          </div>
        </Container>
      </div>
    </DashboardWrapper>
  );
}

export default index