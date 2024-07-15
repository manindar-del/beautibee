import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/trainingdetails.module.scss";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import assets from "@/json/assest";
import Rating from '@mui/material/Rating';
import { training_details } from "../../../ReduxToolkit/trainingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import moment from "moment";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ReactPlayer from "react-player";
import Link from "next/link";

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
  const { productdetailsid } = router.query;

  const dispatch = useDispatch();

  const { training_details_show } = useSelector((state) => state?.training);
  //console.log(training_details_show, "training_details_show");

  /* A react hook that is used to fetch data from the server. */
  useEffect(() => {
    if (router.query.id) {
      dispatch(training_details(router.query.id));
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onErrorImg = (ev) => {
    ev.target.src = assets.noImage;
  };

  return (
    <DashboardWrapper headerType="search" page="user">
      <div className={styles.mainwraper}>
        <div className="container">
          <section className={styles.pageOrder}>
            <>
              <h3
                className="headingH3 pointerBtn"
                onClick={() => router.push("/user/training")}
              >
                <KeyboardBackspaceIcon /> Training
              </h3>
              <ul className={styles.listing_sec}>
                <li>
                  <div className={styles.listing_box}>
                    <div className={`${styles.productimg} ${styles.training_section}`}>
                     
                      <ReactPlayer
                        url={`${mediaPath}/uploads/training/Videos/${training_details_show?.training?.video}`}
                        width="1096px"
                        height="500px"
                        controls={true}
                      />
                      
                    </div>
                  </div>
                </li>
              </ul>

              {training_details_show?.user?.map((item) => {
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
                          <Rating name="read-only" value={item.rating} readOnly />
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
                  <img
                    src={`${mediaPath}/uploads/training/Pictures/${training_details_show?.training?.image}`}
                    alt="img"
                    width={300}
                    height={300}
                    onError={onErrorImg}
                  />
                </div>
                <h2>{training_details_show?.training?.title}</h2>
                <h3>
                  {moment(training_details_show?.training?.publish_date).format(
                    "MMM Do YY"
                  )}
                </h3>
                <p>{training_details_show?.training?.content}</p>
              </div>
            </>
          </section>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default index;
