import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useState } from "react";
import styles from "@/styles/pages/order.module.scss";
import PropTypes from "prop-types";
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
import { useGetUserAllOrderList } from "@/hooks/useOrder";
import MuiRating from "@/components/Rating/Rating";
import moment from "moment";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { Chip, IconButton, Tooltip } from "@mui/material";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { Button, Rating } from "@mui/material";
import Link from "next/link";

const statusList = [
  {
    id: 0,
    value: "New",
  },
  {
    id: 1,
    value: "Old",
  },
];
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
  const [value, setValue] = React.useState(0);
  const [tabListStatus, setTabListStatus] = useState("New");
  const { data } = useGetUserAllOrderList({
    status: tabListStatus,
  });
  console.log(data, "data-user");

  const [values, setValues] = React.useState(0);

  /**
   * It sets the value of the rating to the new value.
   */
  const ratingChanged = (newValue) => {
    setValues(newValue);
  };
  /**
   * The handleChange function takes in an event and a newValue, and sets the value to the newValue
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onErrorImg = (ev) => {
    ev.target.src = assets.noImage;
  };
  const downloadInvoice = (invoiceName) => {
    window.open(`${mediaPath}/uploads/order/invoice/${invoiceName}`);
  };
  return (
    <DashboardWrapper hasSidebar={true} headerType="search" page="user">
      <section className={styles.pageOrder}>
        <div className={styles.dashboradHeadingCom}>
          <h3 className="headingH3">Orders</h3>
          <div className={styles.btnGroups}>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                {statusList.map((item, i) => (
                  <Tab
                    label={`${item.value} Orders`}
                    {...a11yProps(i)}
                    onClick={() => setTabListStatus(item.value)}
                  />
                ))}
              </Tabs>
            </Box>
          </div>
        </div>
        <div className={styles.tabContentArea}>
          <TabPanel value={value} index={value}>
            {data?.pages[0]?.data?.length > 0 ? (
              data?.pages[0]?.data?.map((item) => {
                return (
                  <div className={styles.oredrBox}>
                    <div className={styles.topOrderSec}>
                      {item.order_items.map((items) => {
                        return (
                          <div className={styles.top_head}>
                            <h2>{items.product_name}</h2>
                            <h3>
                              ${items.price} X {items?.quantity}{" "}
                            </h3>
                          </div>
                        );
                      })}
                      <p>{item?.address}</p>
                      <p>Order ID:# {item?.order_number}</p>
                      <Chip
                        label={
                          item?.provider_status === "Approved"
                            ? "Approved"
                            : item?.provider_status === "Complete"
                            ? "Completed"
                            : item?.provider_status === "Reject"
                            ? "Rejected"
                            : "Pending"
                        }
                        size="small"
                        sx={{
                          mt: 2,
                          background:
                            item?.provider_status === "Approved"
                              ? "#e0af28"
                              : item?.provider_status === "Complete"
                              ? "#32ab2e"
                              : item?.provider_status === "Reject"
                              ? "#cc3535"
                              : "#2e5eb8",
                          color: "white",
                        }}
                      />
                      {/* Reason message */}

                      {item?.reject_reason && (
                        <div className={styles.reject_section}>
                          <br />
                          <h3>Reject Reason</h3>
                          <span>{item?.reject_reason}</span>
                        </div>
                      )}
                      <div className={styles.bottom_head}>
                        {/* <h4>15 Min</h4> */}
                        <h5>
                          {moment(item?.order_date).format("MMM Do YY")}{" "}
                          <Image
                            src={assets.calender}
                            alt="img"
                            width={12}
                            height={12}
                          />
                          {item?.provider_status === "Complete" && (
                            <Tooltip
                              title="Download Invoice"
                              sx={{ ml: 2 }}
                              onClick={() =>
                                downloadInvoice(item?.invoice_name)
                              }
                            >
                              <IconButton>
                                <ArrowCircleDownIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </h5>
                      </div>
                    </div>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>View Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <div className={styles.details_lsting}>
                            <div className={styles.left_conts}>
                              {item?.user_info?.profile_image !== null ? (
                                <img
                                  src={`${mediaPath}/uploads/user/profile_pic/${item?.user_info?.profile_image}`}
                                  alt="img"
                                  width={40}
                                  height={40}
                                  onError={onErrorImg}
                                />
                              ) : (
                                <Image
                                  src={assets.noImage}
                                  alt="img"
                                  width={111}
                                  height={43}
                                />
                              )}
                            </div>

                            <div className={styles.right_conts}>
                              <div className={styles.chat_box}>
                              {item?.order_items.map((rating) => {
                                 return (
                                <div className={styles.rating_box}>
                                  <h2>{item?.user_info?.full_name}</h2>
                                  
                                      <Rating
                                        name="read-only"
                                        value={parseInt(rating.user_info?.rating)}
                                        readOnly
                                      />
                                  
                                  <h6> {rating.user_info.rating}({rating.user_info.total_count})</h6>
                                </div>
                                  );
                                })}

                                <p>{item?.city}</p>
                              </div>
                              <div className={styles.chat_sec}>
                                {/* <button>
                                  <Image
                                    src={assets.chat1}
                                    alt="img"
                                    width={40}
                                    height={40}
                                  />
                                </button> */}
                                <Link href="/chat">
                                  <button className={styles.cart}>
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

                          <div className={styles.payment_details}>
                            <h2>Payment Details</h2>
                            {/* <h3>
                              Membership type <span>Basic Plan</span>
                            </h3> */}
                            <h4>
                              SubTotal <span>$ {item?.subTotal}</span>
                            </h4>
                            {/* <h4>
                                  Delivery Fee <span>$ 50.00</span>
                                </h4> */}
                            <h5>
                              Total <span>${item?.subTotal}</span>
                            </h5>
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                );
              })
            ) : (
              <h1 style={{ textAlign: "center" }}>
                Opps! No {tabListStatus} Order's available
              </h1>
            )}
          </TabPanel>
        </div>
      </section>
    </DashboardWrapper>
  );
}

export default index;
