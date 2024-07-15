import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/training.module.scss";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import assets from "@/json/assest";
import { Button } from "@mui/material";
//import Link from '@/themes/overrides/Link';
//import { training_list } from "../../../ReduxToolkit/trainingSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import moment from "moment";
import { useTrainingList } from "@/hooks/useTraining";
import { Pagination, Stack } from "@mui/material";

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
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [page, setPage] = useState(1);

  console.log(page,"page");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePageChange = (event, pageValue) => {
    setPage(pageValue);
  };
  /* Destructuring the object returned by the useTrainingList() hook. */
  const {
    data: allStudioList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTrainingList({
    pagination_page: page,
    pagination_per_page: 5,
  });

  //console.log(allStudioList, "allStudioList");

  return (
    <DashboardWrapper headerType="search" page="user">
      <div className={styles.mainwraper}>
        <div className="container">
          {/* <section className={styles.pageOrder}>
            <div className={styles.heading_sec}>
              <h4>Training</h4>
              <h3 className="headingH3">Latest Uploaded Videos</h3>
            </div>
            <ul className={styles.listing_sec}>
              {training_list_show.map((item) => {
                return (
                  <li>
                    <Link href={`trainingdetails/${item._id}`}>
                      <div className={styles.listing_box}>
                        <div className={styles.productimg}>
                          <Image
                            src={`${mediaPath}/uploads/training/Pictures/${item.image}`}
                            alt="img"
                            width={277}
                            height={170}
                          />
                        </div>
                        <div className={styles.cont_box}>
                          {/* <video
                          controls
                          src={`${mediaPath}/uploads/training/Videos/${item.video}`}
                          width={200}
                          height={100}
                        /> */}

          {/* <h2>{item.title}</h2>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul> */}
          {/* // </section> */}
          <section className={styles.pageOrder}>
            <div className={styles.heading_sec1}>
              <h3 className="headingH3">Tutorial Videos</h3>
              {/* <div className={styles.view_all}>
              
              </div> */}
            </div>
            <ul className={styles.listing_sec1}>
              {allStudioList?.data.map((item) => {
                return (
                  <li>
                    <Link href={`training/${item._id}`}>
                      <div className={styles.listing_box}>
                        <div className={styles.productimg}>
                          {/* <Image
                            src={`${mediaPath}/uploads/training/Pictures/${item.image}`}
                            alt="img"
                            width={215}
                            height={275}
                          /> */}

                          <video
                            controls
                            src={`${mediaPath}/uploads/training/Videos/${item.video}`}
                            width={215}
                            height={275}
                          />
                        </div>
                        <div className={styles.cont_box}>
                          <h2>{item.title}</h2>
                          <p>
                            {moment(item?.publish_date).format("MMM Do YY")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
          {/* <section className={styles.pageOrder}>
            <div className={styles.heading_sec}>
              <h3 className="headingH3">Upcoming Videos</h3>
            </div>
            <ul className={styles.listing_sec}>
              {training_list_show.map((item) => {
                return (
                  <li>
                    <div className={styles.listing_box}>
                      <div className={styles.productimg}>
                        <Image
                          src={`${mediaPath}/uploads/training/Pictures/${item.image}`}
                          alt="img"
                          width={277}
                          height={170}
                        />
                      </div>
                      <div className={styles.cont_box}>
                        {/* <video
                          controls
                          src={`${mediaPath}/uploads/training/Videos/${item.video}`}
                          width={277}
                          height={170}
                        /> */}
          {/* <h2>{item.title}</h2>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section> */}

          <Stack className={styles.paginationmainone} spacing={2}>
            <Pagination
              count={allStudioList?.pages}
              variant="outlined"
              color="primary"
              page={page}
              onChange={handlePageChange}
            />
          </Stack>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default index;
