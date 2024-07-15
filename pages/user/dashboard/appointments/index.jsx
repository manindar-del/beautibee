import React from "react";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/pages/order.module.scss";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import assets from "@/json/assest";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import { useGetAllUserBookingList } from "@/hooks/useAppointmentsBooking";
import { Chip, Divider, Pagination, Stack } from "@mui/material";
import { toHoursAndMinutes } from "@/lib/functions/_common.lib";
import { useState } from "react";
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Appointments = () => {
  const [value, setValue] = useState(1);
  const [page, setPage] = useState(1);
  const { data: allBookingAppList } = useGetAllUserBookingList({
    pagination_page: page,
    pagination_per_page: 5,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePageChange = (event, pageValue) => {
    setPage(pageValue);
  };
  return (
    <DashboardWrapper hasSidebar={true} headerType="search" page="user">
      <section className={styles.pageOrder}>
        <div className={styles.dashboradHeadingCom}>
          <h3 className="headingH3">My Booking history</h3>
          <div className={styles.btnGroups}>
            <Box>
              {/* <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="New Orders" {...a11yProps(0)} />
                <Tab label="Old Orders" {...a11yProps(1)} />
              </Tabs> */}
            </Box>
          </div>
        </div>
        <div className={styles.tabContentArea}>
          <TabPanel value={value} index={1}>
            <div className={styles.oredrBox}>
              {allBookingAppList?.data?.length > 0 ? (
                allBookingAppList?.data?.map((item, i) => (
                  <div className={styles.oredrBox} key={i}>
                    <div className={styles.topOrderSec}>
                      <div className={styles.top_head}>
                        <h2>{item?.provider_info?.business_name}</h2>
                        <h3>Total price : ${item?.total_price}</h3>
                      </div>
                      <Chip
                        label={
                          item?.provider_status === "Complete"
                            ? "Completed"
                            :item?.provider_status === "Pending"
                            ? "Booked"
                            : "Booked"
                        }
                        size="small"
                        sx={{
                          mt: 2,
                          background:
                            item?.provider_status === "Complete"
                              ? "#32ab2e"
                              : "rgba(0, 0, 0, 0.08)",
                        }}
                      />
                      <p>{item?.provider_info?.email}</p>
                      <p>Booking Id: # {item?.booking_number}</p>

                      <div className={styles.bottom_head}>
                        <h5>
                          Booking date :{" "}
                          {moment(item?.booking_startdate).format("MMM DD YYYY")}{" "}
                        </h5>
                      </div>
                    </div>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>View Services</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          {item?.booking_items?.map((bookItem, i) => (
                            <>
                              <div className={styles.payment_details} key={i}>
                                <h2>Details</h2>
                                <h3>
                                  {bookItem?.service_name} <span>Plan</span>
                                </h3>
                                <h4>
                                  Duration{" "}
                                  <span>
                                    {" "}
                                    {toHoursAndMinutes(
                                      bookItem?.service_duration
                                    )}
                                  </span>
                                </h4>

                                <h5>
                                  Total <span>${bookItem?.price}</span>
                                </h5>
                              </div>
                              <Divider />
                            </>
                          ))}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center" }}>No Appointments</div>
              )}
            </div>
          </TabPanel>
          {/* <TabPanel value={value} index={1}>
            Old order
          </TabPanel> */}
        </div>
        {allBookingAppList?.data?.length > 0 && (
          <Stack className={styles.paginationmainone} spacing={2}>
            <Pagination
              count={allBookingAppList?.pages}
              variant="outlined"
              color="primary"
              page={page}
              onChange={handlePageChange}
            />
          </Stack>
        )}
      </section>
    </DashboardWrapper>
  );
};

export default Appointments;
