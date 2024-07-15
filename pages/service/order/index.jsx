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
import Rating from "@/components/Rating/Rating";
import { useRouter } from "next/router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useChangeOrderStatus, useGetAllOrderList } from "@/hooks/useOrder";
import moment from "moment";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import MuiRating from "@/components/Rating/Rating";
import {
  Chip,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import styles2 from "@/styles/pages/jobs.module.scss";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
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

const statusList = [
  {
    id: 0,
    value: "Pending",
  },
  {
    id: 1,
    value: "Approved",
  },
  {
    id: 2,
    value: "Complete",
  },
  {
    id: 3,
    value: "Reject",
  },
];
const style = {
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const btnStyle = {
  margin: "0 5px",
};
const validationSchema = Yup.object().shape({
  reject_reason: Yup.string()
    .required("Reject reason is required!")
    .max(255, "Oops! You can not enter more the 255 Char"),
});
function Index() {
  const router = useRouter();
  //const [status, setStatus] = useState(null);
  const [tabListStatus, setTabListStatus] = useState("Pending");
  const [changeOrderStatus, setChangeOrderStatus] = useState("");
  const { data } = useGetAllOrderList({
    status: tabListStatus,
  });
  const {
    mutate: updateOrderStatus,
    isSuccess,
    isLoading,
  } = useChangeOrderStatus();
  const [value, setValuess] = useState(0);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { errors } = formState;

  useEffect(() => {
    if (isSuccess) {
      setChangeOrderStatus("");
      setOpenRejectModal(false);
      setValue("reject_reason", "");
      setValue("order_id", "");
    }
  }, [isSuccess]);

  const handleChange = (event, newValue) => {
    setValuess(newValue);
  };

  const [values, setValues] = useState(0);

  const ratingChanged = (newValue) => {
    setValues(newValue);
  };

  const onErrorImg = (ev) => {
    ev.target.src = assets.noImage;
  };

  const changeOrdStatus = (e, id) => {
    setChangeOrderStatus(e.target.value);
    if (e.target.value === "Reject") {
      setOpenRejectModal(true);
      setValue("order_id", id);
    } else {
      updateOrderStatus({
        order_id: id,
        status: e.target.value,
        reject_reason: "",
      });
    }
  };

  const rejectOrderSubmit = (data) => {
    updateOrderStatus({
      order_id: data?.order_id,
      status: changeOrderStatus,
      reject_reason: data?.reject_reason,
    });
  };

  const downloadInvoice = (invoiceName) => {
    window.open(`${mediaPath}/uploads/order/invoice/${invoiceName}`);
  };
  return (
    <DashboardWrapper headerType="search" page="service">
      <br></br>
      <br></br>
      <div className="container">
        <section className={styles.pageOrder}>
          <div className={styles.dashboradHeadingCom}>
            <h3
              className="headingH3"
              onClick={() => router.push("/service/dashboard")}
            >
              <KeyboardBackspaceIcon /> Dashboard
            </h3>
            <div className={styles.btnGroups}>
              <Box>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  {statusList.map((item, i) => (
                    <Tab
                      label={
                        item.value === "Approved"
                          ? "Approved"
                          : item.value === "Complete"
                          ? "Completed"
                          : item.value === "Reject"
                          ? "Rejected"
                          : "Pending"
                      }
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
                data?.pages[0]?.data.map((item, i) => {
                  return (
                    <div className={styles.oredrBox} key={i}>
                      <div className={styles.topOrderSec}>
                        {item?.order_items.map((items) => {
                          return (
                            <div className={styles.top_head}>
                              <h2>{items.product_name}</h2>
                              <h3>
                                ${items.price} X {items?.quantity}{" "}
                              </h3>
                            </div>
                          );
                        })}
                        <p>Order ID:# {item?.order_number}</p>
                        <p>{item?.address}</p>
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

                          {item?.provider_status === "Reject" ||
                          item?.provider_status === "Complete" ? (
                            <>
                              {/* <FormControl sx={{ width: 150 }}>
                                <InputLabel id="demo-simple-select-label">
                                  Change Status
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  disabled
                                  label="Change Status"
                                >
                                  {statusList.map((item, i) => (
                                    <MenuItem value={item.value}>
                                      {item.value}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl> */}
                            </>
                          ) : (
                            <>
                              {" "}
                              <FormControl sx={{ width: 150 }}>
                                <InputLabel id="demo-simple-select-label">
                                  Change Status
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={changeOrderStatus}
                                  label="Change Status"
                                  onChange={(e) =>
                                    changeOrdStatus(e, item?._id)
                                  }
                                >
                                  {statusList.map((item, i) => (
                                    <MenuItem key={i} value={item.value}>
                                      {item.value === "Approved"
                                        ? "Approve"
                                        : item.value}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </>
                          )}
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
                                  <div className={styles.rating_box}>
                                    <h2>{item?.user_info?.full_name}</h2>
                                    <MuiRating
                                      onChangeRating={ratingChanged}
                                    />{" "}
                                    <h6> {/* 4.9<p>(575)</p>{" "} */}</h6>
                                  </div>

                                  <p>{item?.city}</p>
                                </div>
                                <div className={styles.chat_sec}>
                                  <button>
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

                            <div className={styles.payment_details}>
                              <h2>Payment Details</h2>
                              <h3>
                                Membership type <span>Basic Plan</span>
                              </h3>
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
                  Opps! No {tabListStatus} Order's available!
                </h1>
              )}
            </TabPanel>
          </div>
        </section>
      </div>

      <Dialog
        open={openRejectModal}
        onClose={() => {
          setOpenRejectModal(false);
          setChangeOrderStatus("");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="jobs_modal"
        scroll={"body"}
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <h3>Reject Order</h3>
            <div className={styles2.messagebox}>
              <div className={styles2.messageformbox}>
                <textarea
                  name="Message"
                  {...register("reject_reason")}
                  placeholder="Message"
                ></textarea>
              </div>
              {errors.reject_reason && (
                <div className="text-danger d-flex">
                  <span style={{ marginLeft: "5px", color: "red" }}>
                    {" "}
                    {errors.reject_reason?.message}{" "}
                  </span>
                </div>
              )}
              <div className={styles2.job_report_submit}>
                <button
                  style={btnStyle}
                  onClick={handleSubmit(rejectOrderSubmit)}
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
                <button
                  onClick={() => {
                    setOpenRejectModal(false);
                    setChangeOrderStatus("");
                  }}
                  className={styles2.buttonCan}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Typography>
        </Box>
      </Dialog>
    </DashboardWrapper>
  );
}

export default Index;
