import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Calendar from "@/components/WeekViewCal";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, Grid, Button, IconButton, Tabs } from "@mui/material";
import styles from "@/styles/pages/searchlisting.module.scss";
import Image from "next/image";
import CreditCardForm  from "./PaymentCard";
import {
  useBookingConfirm,
  useCreateServiceAdd,
  useDeleteServiceBook,
  useEditBookingSlot,
  useGetAllServiceList,
  useGetAllTimeSlot,
  useGetServiceListById,
} from "@/hooks/useSearchListing";
import moment from "moment";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import assest from "@/json/assest";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6,
  responsive: [
    {
      breakpoint: 540,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
  ],
};
const ServiceBookModal = ({
  showDetailsHandle,
  open,
  setOpen,
  setSelectSlot,
  selectHour,
  setSelectHour,
  technicianID,
  date,
  timeSlot,
  setTimeSlot,
  selectSlot,
  technicaianDetails,
  setTechnicaianDetails,
  allserviceProvider,
  latitude,
  longitude,
  clientSecret,
  refetch,
  searchList,
}) => {
  const [value, setValue] = useState("2");
  const [openAnotherModal, setOpenAnotherModal] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [makePaymentModal, setMakePaymentModal] = useState(false);
  
  
  const { data: allServiceBookingList } = useGetAllServiceList({
    provider_id: technicianID,
  });
  //console.log(technicaianDetails, "technicaianDetails");

  const stripePromise = loadStripe('pk_test_51NC8juH8DTESxykdMLuQqFAyDY7Zr6bynV7U961EXoD0cufh8oiv3qb8mppMMixOe2dibNEIjBfpNgwqzpICEeg800YKxDHyj6');

  /* Using the useGetAllTimeSlot hook to get all the time slots for a given date and daytime. */
  const { data: allTimeSlotList } = useGetAllTimeSlot({
    provider_id: technicianID,
    booking_date:
      date !== null
        ? moment(date).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),

    daytime: selectSlot,
    current_time: moment().format("HH:mm"),
    today_date: moment().format("YYYY-MM-DD"),
  });

  const { mutate: getServiceListByID, data: allServiceListByID } =
    useGetServiceListById();
  const { mutate: DeleteServiceBooking } = useDeleteServiceBook();
  const { mutate: editBookingSlot } = useEditBookingSlot();
  const {  data:paymentDetails, mutate: bookingConfirm, isLoading, isSuccess } = useBookingConfirm();
 

  const { mutate: createServiceBooking } = useCreateServiceAdd();
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (isSuccess) {
      setConfirmPayment(false);
      setOpenAnotherModal(false);
      setOpen(false);
      setMakePaymentModal(false);
      //allserviceProvider();
     
    }
  }, [isSuccess]);

 

  useEffect(() => {
    if (isSuccess && allserviceProvider) {
      allserviceProvider();
    }
  }, [isSuccess, allserviceProvider]);
  

  const onErrorImg = (ev) => {
    ev.target.src = assest.listImg;
  };

const appearance = {
  theme: "night",
};

const options = {
  clientSecret,
  appearance,
};



//console.log(clientSecret,"clientSecret");

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setTechnicaianDetails(null);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        scroll={"body"}
        fullWidth
      >
        <div className={styles.pickdatemain}>
          <div className={styles.headingtext}>
            <h2>Pick Date & Time</h2>

            <IconButton
              color="primary"
              aria-label="upload picture"
              onClick={() => {
                setOpen(false);
                setTechnicaianDetails(null);
              }}
              className={styles.closeicon}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </div>
          <div className={styles.calendermain}>
            <Calendar
              showDetailsHandle={showDetailsHandle}
              allTimeSlotList={allTimeSlotList?.data}
            />
          </div>

          <div className="muitab">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box
                  className={styles.tablemain1}
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  <TabList
                    onChange={handleChangeTab}
                    aria-label="lab API tabs example"
                    className={styles.tablemain2}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab
                      label="Morning"
                      value="1"
                      onClick={() => {
                        setSelectSlot("morning");
                        setSelectHour("");
                      }}
                    />
                    
                    <Tab
                      label="Afternoon"
                      value="2"
                      onClick={() => {
                        setSelectSlot("afternoon");
                        setSelectHour("");
                      }}
                    />
                    <Tab
                      label="Evening"
                      value="3"
                      onClick={() => {
                        setSelectSlot("evening");
                        setSelectHour("");
                      }}
                    />
                  </TabList>
                </Box>
                <TabPanel value={value}>
                  {allTimeSlotList?.data !== undefined ? (
                    <>
                      <div className={styles.timesilder}>
                        <Slider {...settings}>
                          {allTimeSlotList?.data?.map((item, i) => {
                            return (
                              <div key={i}>
                                <div
                                  className={`${styles.timemain}  ${
                                    item?.status
                                      ? styles.disabled
                                      : selectHour === item?.time
                                      ? styles.active
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectHour(item?.time);
                                    setTimeSlot(true);
                                    editBookingSlot({
                                      provider_id: technicianID,
                                      booking_startdate:
                                        date !== null
                                          ? `${moment(date).format(
                                              "YYYY-MM-DD"
                                            )} ${item?.time}`
                                          : `${moment().format("YYYY-MM-DD")} ${
                                              item?.time
                                            }`,
                                    });
                                  }}
                                >
                                  {/* {item?.time} */}
                                  {/* {new Date(
                                  "1970-01-01T" + item?.time + "Z"
                                ).toLocaleTimeString("en-US", {
                                  timeZone: "UTC",
                                  hour12: true,
                                  hour: "numeric",
                                  minute: "numeric",
                                })} */}
                                  {moment(item?.time, "hh:mm a").format(
                                    "hh:mm a"
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      </div>
                    </>
                  ) : (
                    <>No time slot avilable</>
                  )}
                </TabPanel>
              </TabContext>
              <div
                style={{
                  height: "350px",
                  overflowX: "hidden",
                  overflowY: "auto",
                }}
              >
                {allServiceBookingList?.data?.booking_info !== undefined ? (
                  <>
                    {allServiceBookingList?.data?.booking_info?.map(
                      (item, i) => (
                        <div className={styles.remidial} key={i}>
                          <div className={styles.redialtop}>
                            <Grid container spacing={2}>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                className={styles.toptext1}
                              >
                                {item?.service_title}

                                {/* {allServiceBookingList?.data?.booking_info
                                  ?.length <= 1 ? (
                                  ""
                                ) : (
                                  <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    onClick={() => {
                                      DeleteServiceBooking({
                                        booking_id: item?._id,
                                      });
                                    }}
                                    className={styles.closeicon}
                                  >
                                    <CloseIcon sx={{ color: "black" }} />
                                  </IconButton>
                                )} */}
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                className={styles.toptext1}
                                align="right"
                              >
                                ${item?.service_price}
                              </Grid>
                              <Grid
                                className={`${styles.toptext2} ${styles.toptext4}`}
                                item
                                xs={12}
                                md={6}
                              >
                                {/* {item?.service_duration} min */}
                              </Grid>
                              <Grid
                                className={styles.toptext2}
                                item
                                xs={12}
                                md={6}
                                align="right"
                              >
                                {/* {item?.booking_slot !== ""
                                  ? item?.booking_slot
                                  : "Please choose a date & slot"}{" "} */}
                                {/* {moment(item?.booking_startdate).format(
                                  "hh:mm a"
                                )}{" "}
                                -{" "}
                                {moment(item?.booking_enddate).format(
                                  "hh:mm a"
                                )} */}
                                {/* utc time */}
                                {moment(item?.booking_startdate)
                                  .utc()
                                  .format("hh:mm A")}{" "}
                                -{" "}
                                {moment(item?.booking_enddate)
                                  .utc()
                                  .format("hh:mm A")}
                              </Grid>
                            </Grid>
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              onClick={() => {
                                DeleteServiceBooking({
                                  booking_id: item?._id,
                                });
                              }}
                              className={styles.closeicon}
                            >
                              <CloseIcon sx={{ color: "black" }} />
                            </IconButton>
                          </div>
                          <Grid container spacing={2}>
                            <Grid
                              className={`${styles.toptext2} ${styles.toptext5}`}
                              item
                              xs={12}
                              md={6}
                            >
                              {
                                allServiceBookingList?.data?.provider_info
                                  ?.full_name
                              }
                            </Grid>
                            {/* <Grid
                              className={styles.changetext} 
                              item
                              xs={12}
                              md={6}
                              align="right"
                            >
                              Change
                            </Grid> */}
                          </Grid>
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <>no data found! Please add service's</>
                )}
              </div>

              <Grid container spacing={2}>
                <Grid className={styles.addanotherservice} item xs={12}>
                  <Button
                    onClick={() => {
                      setOpenAnotherModal(true);
                      getServiceListByID({
                        user_id: technicianID,
                        latitude: latitude,
                        longitude: longitude,
                        maxDistance: 5,
                        pagination_page: 0,
                        pagination_per_page: 100,
                      });
                    }}
                  >
                    {" "}
                    + Add another service{" "}
                  </Button>
                </Grid>

                <Grid className={styles.totalsection} item xs={12}>
                  <h3>Total</h3>
                  <h4>${allServiceBookingList?.data?.total_price}</h4>
                  <h5>{allServiceBookingList?.data?.total_time}min</h5>
                </Grid>
                <Grid className={styles.confirmbutton} item xs={12}>
                  <Button
                    onClick={() => {
                      // bookingConfirm({
                      //   provider_id: technicianID,
                      //   amount: allServiceBookingList?.data?.total_price,
                      //   currency:"usd",
                      //    platform: "web",
                      // });

                    
                      // setOpen(false);
                      
                      
                       setConfirmPayment(true);
                      
                      
                    }}
                    disabled={
                      allServiceBookingList?.data == null || timeSlot === false
                    }
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openAnotherModal}
        onClose={() => setOpenAnotherModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        scroll={"body"}
        fullWidth
      >
        <div className={styles.pickdatemain}>
          <div className={styles.headingtext}>
            {/* <h2>Add more service</h2> */}
            <div className={styles.business_header}>
              <div className={styles.business_header_left}>
                {technicaianDetails?.business_image ? (
                  <>
                    {technicaianDetails?.business_image !== null ? (
                      <img
                        src={`${mediaPath}/uploads/user/business_image/${technicaianDetails?.business_image}`}
                        alt="img"
                        width={50}
                        height={50}
                        onError={onErrorImg}
                      />
                    ) : (
                      <Image
                        src={assest.listImg}
                        alt="img"
                        width={50}
                        height={50}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {technicaianDetails?.profile_image ? (
                      <img
                        src={`${mediaPath}/uploads/user/profile_pic/${technicaianDetails?.profile_image}`}
                        alt="img"
                        width={50}
                        height={50}
                        onError={onErrorImg}
                      />
                    ) : (
                      <Image
                        src={assest.listImg}
                        alt="img"
                        width={50}
                        height={50}
                      />
                    )}
                  </>
                )}

                <h2>
                {technicaianDetails?.full_name ? technicaianDetails?.full_name : technicaianDetails?.business_name }
                  {/* {technicaianDetails?.business_name} */}
                  <p> {technicaianDetails?.email}</p>
                </h2>
              </div>
              <div className={styles.business_header_right}>
                <h3>
                  {technicaianDetails?.rating}
                  <sub>/5</sub>
                </h3>
              </div>
            </div>
            <div className={styles.listing_sec_box}>
              <ul>
                {allServiceListByID !== undefined ? (
                  <>
                    {allServiceListByID?.data?.map((item, i) => (
                      <li key={i}>
                        <div className={styles.listing_sec_box_left}>
                          <h2>{item?.title}</h2>
                          <p>{item?.category_info?.title}</p>
                          {/* <h3>Save up to 15%</h3> */}
                        </div>
                        <div className={styles.listing_sec_box_right}>
                          <div className={styles.price_box}>
                            <h2>
                              {/* <del>$30.00</del> +$25.50 */}${item?.price}
                            </h2>
                            <p>{item?.duration}min</p>
                          </div>
                          <Button
                            className={
                              item?.isBooking
                                ? styles.disabled
                                : styles.btn_right_box
                            }
                            onClick={() => {
                              createServiceBooking({
                                service_id: item?._id,
                              });
                              
                              setOpenAnotherModal(false);
                            }}
                            disable={item?.isBooking}
                          >
                            {item?.isBooking ? "Booked" : "Book"}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </>
                ) : (
                  <>Time Slot not avialble</>
                )}
              </ul>
            </div>

            <IconButton
              color="primary"
              onClick={() => setOpenAnotherModal(false)}
              className={styles.closeicon}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </div>
        </div>
      </Dialog>

      <Dialog
        className="confirm-payment"
        open={confirmPayment}
        // onClose={() => setConfirmPayment(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        scroll={"body"}
        fullWidth
      >
        <div className={styles.pickdatemain}>
          <div className={styles.headingtext}>
            {/* <h2>Confirm Payment</h2> */}
            <h2>Do you want pay?</h2>
            <div className={styles.listing_sec_box}>
              {/* <p>Do you want pay?</p> */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "40px",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setMakePaymentModal(true);
                    setConfirmPayment(false);
                    setOpenAnotherModal(false);
                    setOpen(false);
                    
                    
                  }}
                >
                  Confirm
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ margin: "0 0 0 5px" }}
                  onClick={() => {
                    setConfirmPayment(false);
                    setOpenAnotherModal(false);
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>

            <IconButton
              color="primary"
              onClick={() => {
                setConfirmPayment(false);
                setOpenAnotherModal(false);
                setOpen(false);
              }}
              className={styles.closeicon}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </div>
        </div>
      </Dialog>

      <Dialog
        className="card-modal"
        open={makePaymentModal}
        // onClose={() => setConfirmPayment(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        scroll={"body"}
        fullWidth
      >
        <div className={styles.pickdatemain}>
          <div className={styles.headingtext}>
            <h2>Make Payment</h2>
            {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
            <CreditCardForm
              total_price={allServiceBookingList?.data?.total_price}
              technicianID={technicianID}
              bookingConfirm={bookingConfirm}
              isLoading={isLoading}
              allserviceProvider={allserviceProvider}
              clientSecret={clientSecret}
              refetch={refetch}
              setMakePaymentModal ={setMakePaymentModal}
              searchList={searchList}
              />
              </Elements>
            )}
            <IconButton
              color="primary"
              onClick={() => {
                setConfirmPayment(false);
                setOpenAnotherModal(false);
                setOpen(false);
                setMakePaymentModal(false);
              }}
              className={styles.closeicon}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ServiceBookModal;
