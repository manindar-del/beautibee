import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/trainingdetails.module.scss";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import assets from "@/json/assest";

import { GetTrainingDetails } from "@/hooks/useTraining";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { useMutation } from "react-query";
import moment from "moment";
import MuiRating from "@/components/Rating/Rating";
import ReactPlayer from "react-player";
import Link from "next/link";
import { Button, Rating } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function index() {
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  const [values, setValues] = React.useState(0);

  const ratingChanged = (newValue) => {
    setValues(newValue);
  };

  const { mutate, data } = useMutation("training", (variables) =>
    GetTrainingDetails(variables)
  );

  useEffect(() => {
    if (router.query.id) {
      mutate(router.query.id);
    }
  }, [router.query.id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onErrorImg = (ev) => {
    ev.target.src = assets.noImage;
  };

  return (
    <DashboardWrapper headerType="search" page="service">
      <div className={styles.mainwraper}>
        <div className="container">
          <section className={styles.pageOrder}>
            <>
              <div className={styles.heading_sec}>
                <h3
                  className="headingH3 pointerBtn"
                  onClick={() => router.push("/service/training")}
                >
                  <KeyboardBackspaceIcon /> Training
                </h3>
              </div>

              <ul className={styles.listing_sec}>
                <li className={styles.listing_secone}>
                  <div className={styles.listing_box}>
                    <div className={styles.productimg}>
                      <div className="player-wrapper">
                        <ReactPlayer
                          url={`${mediaPath}/uploads/training/Videos/${data?.data?.training?.video}`}
                          width="100%"
                          height="90%"
                          controls={true}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              {data?.data?.user?.map((item) => {
                return (
                  <div className={styles.details_lsting}>
                    <div className={styles.left_conts}>
                      {item?.business_image !== null ? (
                        <img
                          src={`${mediaPath}/uploads/user/business_image/${item?.business_image}`}
                          alt="img"
                          width={70}
                          height={70}
                          onError={onErrorImg}
                        />
                      ) : (
                        <Image
                          src={assets.noImage}
                          alt="img"
                          width={70}
                          height={70}
                        />
                      )}
                    </div>
                    <div className={styles.right_conts}>
                      <div className={styles.chat_box}>
                        <div className={styles.rating_box}>
                          <h2>{item?.full_name}</h2>
                          <Rating
                            name="read-only"
                            value={item?.rating}
                            readOnly
                          />
                          <h6>
                            {" "}
                            {item?.rating}
                            <p>({item?.total_count})</p>{" "}
                          </h6>
                        </div>
                        <p>{item?.city}</p>
                      </div>
                      <div className={styles.chat_sec}>
                       
                          <button onClick={() => router.push(`//chat/${router?.query?.id}`)}>
                            <Image
                              src={assets.chat1}
                              alt="img"
                              width={40}
                              height={40}
                            />
                          </button>
                        
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className={styles.details_cont}>
                <div className={styles.cont_box}>
                  <br />
                  <h2>Resource</h2>
                  <br />
                  {data?.data?.training?.image !== null ? (
                    <img
                      src={`${mediaPath}/uploads/training/Pictures/${data?.data?.training?.image}`}
                      alt="img"
                      width={300}
                      height={300}
                      onError={onErrorImg}
                    />
                  ) : (
                    <Image
                      src={assets.noImage}
                      alt="img"
                      width={300}
                      height={300}
                    />
                  )}
                </div>
                <h2>{data?.data?.training?.title}</h2>
                <h3>
                  {moment(data?.data?.training?.publish_date).format(
                    "MMM Do YY"
                  )}
                </h3>
                <p>{data?.data?.training?.content}</p>
              </div>
            </>
          </section>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default index;
