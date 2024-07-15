import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/trainingdetails.module.scss";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import assets from "@/json/assest";
import { GetServiceDetails } from "@/hooks/useService";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import moment from "moment";
import MuiRating from "@/components/Rating/Rating";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import assest from "@/json/assest";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
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

  const { mutate, data } = useMutation("service", (variables) =>
    GetServiceDetails(variables)
  );

  useEffect(() => {
    if (router.query.id) {
      mutate(router.query.id);
    }
  }, [router.query.id]);

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
                  onClick={() => router.push("/service/service")}
                >
                  <KeyboardBackspaceIcon /> Service
                </h3>
              </div>
              <ul className={styles.listing_sec}>
                <li>
                  <div className={styles.listing_box}></div>
                </li>
              </ul>
              {data?.data?.map((item) => {
                return (
                  <>
                    <div
                      className={`${styles.details_lsting} ${styles.service_details_box_sec}`}
                    >
                      <div className={styles.left_conts}>
                        {item?.user_info?.business_image !== null ? (
                          <img
                            src={`${mediaPath}/uploads/user/business_image/${item?.user_info?.business_image}`}
                            alt="img"
                            width={70}
                            height={70}
                            onError={onErrorImg}
                          />
                        ) : (
                          <Image
                            src={assets.noImage}
                            alt="img"
                            width={100}
                            height={130}
                          />
                        )}
                      </div>
                      <div className={styles.right_conts}>
                        <div className={styles.chat_box}>
                          <div className={styles.rating_box}>
                            <h2>{item?.user_info?.full_name}</h2>
                            <Rating
                              name="read-only"
                              value={item?.rating}
                              readOnly
                            />
                            <h6>
                              {" "}
                              {item?.user_info?.rating}
                              <p>({item?.user_info?.total_count})</p>{" "}
                            </h6>
                          </div>
                          <p>{item?.address}</p>
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
                    <div className="details">
                      <div className={styles.details_cont}>
                        <h2>{item?.title}</h2>
                        <h3>{moment(item?.createdAt).format("MMM Do YY")}</h3>
                        <p>{item?.description}</p>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          </section>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default index;
