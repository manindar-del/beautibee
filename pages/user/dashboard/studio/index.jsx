import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/studio.module.scss";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Box, Dialog, Pagination, Grid } from "@mui/material";
import Image from "next/image";
import assets from "@/json/assest";
import Slider from "react-slick";
import Link from "next/link";
import {
  studio_list,
  studio_details,
} from "../../../../ReduxToolkit/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { Cookies } from "react-cookie";
import assest from "@/json/assest";
import {
  useGetAllStudioCategoryList,
  useGetAllStudioUserList,
} from "@/hooks/useStudio";
import { Stack, style } from "@mui/system";
import ReactPlayer from "react-player";
import Rating from "@mui/material/Rating";
import MuiRating from "@/components/Rating/Rating";

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
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function index() {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [openStudioDetails, setOpenStudioDetails] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);

  const { studio_details_show } = useSelector((state) => state?.dashbord);

  //console.log(studio_details_show,"studio_details_show");
  const { data: allStudioCategoryList } = useGetAllStudioCategoryList();
  const { data: allStudioList } = useGetAllStudioUserList({
    category_id: categoryId,
    pagination_page: page,
    pagination_per_page: 5,
  });

  //console.log(allStudioList, "allStudioList");

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // fetch studio details by id
  const handleOpenStudioDetails = (id) => {
    setOpenStudioDetails(true);
    dispatch(studio_details(id));
  };

  // star rating
  const [values, setValues] = useState(0);

  const ratingChanged = (newValue) => {
    setValues(newValue);
  };

  /**
   * It sets the state of the openStudioDetails variable to false
   */
  const handleCloseStudioDetails = () => setOpenStudioDetails(false);

  /**
   * The handleChange function takes in an event and a newValue, and sets the value to the newValue
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * The function takes in an event and a pageValue, and then sets the page to the pageValue
   */
  /**
   * If the image fails to load, replace it with a default image
   */
  const onErrorImg = (ev) => {
    ev.target.src = assets.personimage1;
  };
  /**
   * The function takes in an event and a pageValue, and then sets the page to the pageValue
   */
  const handlePageChange = (event, pageValue) => {
    setPage(pageValue);
  };

  return (
    <DashboardWrapper hasSidebar={true} headerType="search" page="user">
      <section className={styles.pageOrder}>
        <div className={styles.heading_sec}>
          <h3 className="headingH3">Studio</h3>
          <div className={styles.btnGroups}>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label={"All"}
                  {...a11yProps(0)}
                  onClick={() => {
                    setCategoryId(null);
                    setPage(1);
                  }}
                />
                {allStudioCategoryList?.data?.map((item, i) => (
                  <Tab
                    key={i}
                    label={item?.title}
                    {...a11yProps(i)}
                    onClick={() => {
                      setCategoryId(item?._id);
                      setPage(1);
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </div>
        </div>
        <div className={styles.tabContentArea11}>
          {allStudioList?.data?.map((item, i) => (
            <TabPanel
              className={styles.tabmainone}
              value={value}
              index={value}
              key={i}
            >
              <div className={styles.oredrBox}>
                <div className={styles.topOrderSec}>
                  <div className={styles.listing_box}>
                    {/* <Slider {...settings}> */}
                    <div>
                      <div className={styles.img_box}>
                        {item?.images !== null ? (
                          <img
                            src={`${mediaPath}/uploads/studio/images/${item?.images}`}
                            width={200}
                            height={200}
                            onError={onErrorImg}
                          />
                        ) : (
                          <Image
                            src={assets.noImage}
                            alt="img"
                            width={200}
                            height={200}
                          />
                        )}

                        {/* <video
                          src={`${mediaPath}/uploads/studio/videos/${item?.video}`}
                          width={140}
                          height={140}
                        /> */}
                      </div>
                    </div>
                    {/* </Slider> */}
                    <div className={styles.cont_box}>
                      <h3>{item.name}</h3>
                      {/* <p>{item.content}</p> */}
                      <h4>${item.price}</h4>
                      <div className={styles.rating_box}>
                        <div className={styles.left_cont_box}>
                          {/* <Image
                            src={assets.person}
                            alt="img"
                            width={40}
                            height={40}
                          /> */}

                          <img
                            src={`${mediaPath}/uploads/user/business_image/${item?.user_info?.business_image}`}
                            alt="img"
                            width={40}
                            height={40}
                            onError={onErrorImg}
                          />
                        </div>
                        <div className={styles.right_cont_box}>
                          <h2>{item?.user_info?.full_name}</h2>
                          <p>
                            {item.city}{" "}
                            <span>
                              <Image
                                src={assets.star}
                                alt="img"
                                width={12}
                                height={12}
                              />{" "}
                              {item?.user_info?.rating}
                            </span>
                            ({item?.user_info?.total_count})
                          </p>
                        </div>
                      </div>
                      {/* <Link href={`studio/${item._id}`}>
                          {" "}
                        </Link> */}
                      <h5 onClick={() => handleOpenStudioDetails(item?._id)}>
                        See Details
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          ))}
        </div>
      </section>
      {allStudioList?.data?.length > 0 && (
        <Stack className={styles.paginationmainone} spacing={2}>
          <Pagination
            count={allStudioList?.pages}
            variant="outlined"
            color="primary"
            page={page}
            onChange={handlePageChange}
          />
        </Stack>
      )}
      {studio_details_show?.studio?.video !== undefined ? (
        <Dialog
          open={openStudioDetails}
          onClose={handleCloseStudioDetails}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="jobs_modal"
          scroll={"body"}
        >
          {studio_details_show?.studio !== null ? (
            <>
              <div className={styles.details_box}>
                {/* {studio_details_show?.studio?.images !== null ? (
                <img
                  src={`${mediaPath}/uploads/studio/images/${studio_details_show?.studio?.images}`}
                  width={200}
                  height={180}
                  onError={onErrorImg}
                />
              ) : (
                <Image src={assets.noImage} alt="img" width={111} height={43} />
              )} */}

                <ReactPlayer
                  url={`${mediaPath}/uploads/studio/videos/${studio_details_show?.studio?.video}`}
                  width="100%"
                  height="100%"
                  controls={true}
                />
                <div className={styles.title_studio}>
                  <h3>{studio_details_show?.studio?.name}</h3>
                  <p>{studio_details_show?.studio?.content}</p>
                </div>
                <div className={styles.chat_studio}>
                  <div className={styles.chat_sec}>
                     <Link href={`//chat/${studio_details_show?.studio?.user_id}`}>
                      <button>
                        <Image
                          src={assets.chat1}
                          alt="img"
                          width={40}
                          height={40}
                        />
                      </button>
                      </Link>
                   
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>loading...</>
          )}
        </Dialog>
      ) : (
        <></>
      )}
    </DashboardWrapper>
  );
}

export default index;
