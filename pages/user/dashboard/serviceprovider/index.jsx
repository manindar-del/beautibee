import React, { useEffect, useState } from "react";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/pages/serviceprovider.module.scss";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Box, Dialog, Pagination } from "@mui/material";
import Image from "next/image";
import assets from "@/json/assest";
import {
  getAllTechnician,
  getTechnicianDetails,
} from "@/reduxtoolkit/serviceProvider.slice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import {
  useGetAllBadgeList,
  useGetAllServiceProviderUserList,
} from "@/hooks/useTechnicianFeedback";
import { Stack } from "@mui/system";
const style = {
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
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

  const { getAllTechData, isAllTechLoad, getTechDetails } = useSelector(
    (store) => store.serviceProvider
  );
  const { data: allBadgeList } = useGetAllBadgeList();

  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const [badgeId, setBadgeId] = useState(null);
  const [openTechnicianDetailsModal, setOpenTechnicianDetailsModal] =
    useState(false);

  const { data: allServiceProviderList } = useGetAllServiceProviderUserList({
    badge_id: badgeId,
    pagination_page: page,
    pagination_per_page: 8,
  });

 //console.log(allServiceProviderList,"allServiceProviderList");



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  // const technicianDetails = (id) => {
  //   setOpenTechnicianDetailsModal(true);
  //   dispatch(
  //     getTechnicianDetails({
  //       user_id: id,
  //     })
  //   );
  // };
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
          <h3 className="headingH3">Service Provider</h3>
          <div className={styles.btnGroups}>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label="ALL"
                  {...a11yProps(0)}
                  onClick={() => {
                    setBadgeId(null);
                    setPage(1);
                  }}
                />
                {allBadgeList?.data?.map((item, i) => (
                  <Tab
                    key={i}
                    label={item?.title}
                    {...a11yProps(i)}
                    onClick={() => {
                      setBadgeId(item?._id);
                      setPage(1);
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </div>
        </div>
        {/* <div className={styles.tabContentArea} className={styles.listingmainconone}> */}
        <div className={styles.listingmaincontain}>
          {allServiceProviderList?.data?.map((item, i) => (
            <TabPanel
              value={value}
              index={value}
              key={i}
              className={styles.listingmaincon}
            >
              <ul className={styles.listing_sec}>
                <li
                // onClick={() => technicianDetails(item?._id)}
                // style={{ cursor: "pointer" }}0
                >
                  <Link href={`/user/dashboard/serviceprovider/${item?._id}`}>
                    <div className={styles.listing_box}>
                      <img
                        src={`${mediaPath}/uploads/user/business_image/${item?.business_image}`}
                        alt="img"
                        width={158}
                        height={183}
                        onError={onErrorImg}
                      />
                      <div className={styles.cont_box}>
                        {/* <h3>20% Off</h3> */}
                        <h2>
                          {item?.full_name}{" "}
                          <span>
                            <Image
                              src={assets.star}
                              alt="img"
                              width={12}
                              height={12}
                            />{" "}
                            {item?.rating}
                            ({item?.total_count})
                          </span>
                        </h2>
                        <p>
                          {item?.city ? item?.city : "Melbourne, Au"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </TabPanel>
          ))}
        </div>
      </section>
      {allServiceProviderList?.data?.length > 0 && (
        <Stack className={styles.paginationmainone} spacing={2}>
          <Pagination
            count={allServiceProviderList?.pages}
            variant="outlined"
            color="primary"
            page={page}
            onChange={handlePageChange}
          />
        </Stack>
      )}
      {/* <Dialog
        open={openTechnicianDetailsModal}
        onClose={() => setOpenTechnicianDetailsModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="jobs_modal"
        scroll={"body"}
      >
        {getTechDetails !== null ? (
          <>
            <Box sx={style}>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div className={styles.details_sec}>
                  <img
                    src={`${mediaPath}/uploads/user/profile_pic/${getTechDetails?.profile_image}`}
                    alt="img"
                    width={158}
                    height={183}
                    onError={onErrorImg}
                    className={styles.imgbox}
                  />
                  <h3>{getTechDetails?.full_name}</h3>
                  <span>
                    {" "}
                    <Image
                      src={assets.star}
                      alt="img"
                      width={12}
                      height={12}
                    />{" "}
                    4.9{" "}
                  </span>
                  <h2>20%</h2>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </p>
                </div>
              </Typography>
            </Box>
          </>
        ) : (
          <>loading...</>
        )}
      </Dialog> */}
    </DashboardWrapper>
  );
}

export default index;
