import React, { useState, useEffect, useRef } from "react";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/pages/order.module.scss";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Box,
  Dialog,
  Grid,
  Chip,
  Divider,
  Pagination,
  Stack,
  Tab,
  Tabs,
  Typography,
  DialogContent,
  FormControl,
  MenuItem,
  IconButton,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import assest from "@/json/assest";
import {
  providerBookingDate,
  providerBookingDateDetails,
} from "@/hooks/useAppointmentsBooking";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";

import { useChangeProviderBookingStatus } from "@/hooks/useProviderBookingStatus";
import moment from "moment";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toHoursAndMinutes } from "@/lib/functions/_common.lib";
import { useQuery } from "react-query";
import CloseIcon from "@mui/icons-material/Close";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

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

const statusList = [
  // {
  //   id: 0,
  //   value: "Pending",
  // },

  {
    id: 0,
    value: "Complete",
  },
];

const BookingHistory = () => {
  const router = useRouter();
  const calendarRef = useRef();
  const [value, setValue] = useState(1);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [scroll, setScroll] = useState("");
  const [changeOrderStatus, setChangeOrderStatus] = useState("");

  const { data: allProviderBookingDateList } = providerBookingDate();

  const [startDate, setStartDate] = useState(new Date());

  const {
    mutate: updateProviderBookingStatus,
    isSuccess,
    isLoading,
  } = useChangeProviderBookingStatus();

  useEffect(() => {
    if (isSuccess) {
      setChangeOrderStatus("");
      refetch();
      setOpenModal(false);
    }
  }, [isSuccess]);

  const { data: providerAllDetailsBooking, refetch } = useQuery(
    [
      "bookingDetails",
      moment(
        bookingDetails.event?._def?.extendedProps?.Booking_date,
        "YYYY DD MMM"
      ).format("YYYY-MM-DD"),
    ],
    () =>
      providerBookingDateDetails(
        moment(
          bookingDetails.event?._def?.extendedProps?.Booking_date,
          "YYYY DD MMM"
        ).format("YYYY-MM-DD")
      )
  );

  //console.log(providerAllDetailsBooking, "providerAll");

  const events = allProviderBookingDateList?.data?.map((item) => {
    return {
      title: "Show more",
      start: item,
      Booking_date: moment(item).format("YYYY DD MMM"),
    };
  });
  //console.log(events,"events");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handlePageChange = (event, pageValue) => {
    setPage(pageValue);
  };

  // a custom render function
  function renderEventContent(eventInfo) {
    return (
      <div className={styles.order_box}>
        <div>{eventInfo.event.title}</div>
      </div>
    );
  }

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getDateList = (r) => {
    setBookingDetails(r);
  };

  const changeBookingStatus = (e, id) => {
    setChangeOrderStatus(e.target.value);
    updateProviderBookingStatus({
      booking_id: id,
      status: e.target.value,
    });
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
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              name="view"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                calendarRef.current.getApi().gotoDate(new Date(date));
              }}
              inputFormat="YYYY-MM-DD"
              disableFuture
              enablePast
              renderInput={(params) => (
                <TextField
                  // helperText={invalid ? error.message : null}
                  placeholder="Select Start date"
                  {...params}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <Image
                            src={assest.calender}
                            alt="img"
                            width={17}
                            height={17}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={events}
            eventContent={renderEventContent}
            eventClick={(r) => {
              setOpenModal(true);
              setScroll();
              handleCloseMenu();
              getDateList(r);
            }}
            goToDate={startDate}
          />

          <Dialog
            open={openModal}
            // onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="bookingdetails"
            scroll={scroll}
            maxWidth="xs"
            fullWidth
          >
            <DialogContent>
              <Grid container spacing={2}>
                <>
                  {providerAllDetailsBooking?.data?.data?.length > 0 ? (
                    providerAllDetailsBooking?.data?.data?.map((item, i) => (
                      <Grid item xs={12} md={12} className="boxone">
                        <div className={styles.oredrBox} key={i}>
                          <div className={styles.topOrderSec}>
                            <div className={styles.top_booking}>
                              <h2>{item?.customer_info?.full_name}</h2>
                              <h3>Total price : ${item?.total_price}</h3>
                            </div>

                            <Chip
                              label={
                                item?.provider_status === "Complete"
                                  ? "Complete"
                                  : "Pending"
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
                            {/* <Chip
                              label={item?.provider_status}
                              color={
                                item?.provider_status === "Pending"
                                  ? "warning"
                                  : "success"
                              }
                              variant="outlined"
                              sx={{
                                mb: 2,
                                fontSize: "12px",
                              }}
                            /> */}
                            <p>{item?.customer_info?.email}</p>
                            <p>Booking No: # {item?.booking_number}</p>

                            <div className={styles.bottom_head}>
                              <h5>
                                Booking date :{" "}
                                {moment(item?.booking_startdate).format(
                                  "MMM DD YYYY"
                                )}{" "}
                              </h5>
                              {item?.provider_status === "Complete" ? null : (
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
                                      changeBookingStatus(e, item?._id)
                                    }
                                  >
                                    {statusList.map((item, i) => (
                                      <MenuItem key={i} value={item.value}>
                                        {item.value}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </div>
                          </div>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography>View Booked Services</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography>
                                {item?.booking_items?.map((bookItem, i) => (
                                  <>
                                    <div
                                      className={styles.payment_details}
                                      key={i}
                                    >
                                      <h2>Details</h2>
                                      <h3>
                                        {bookItem?.service_name}{" "}
                                        <span>Plan</span>
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
                      </Grid>
                    ))
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      No Booking History
                    </div>
                  )}
                </>
              </Grid>
            </DialogContent>
            <div className={styles.booking_cross_sign}>
              <IconButton
                color="primary"
                onClick={() => {
                  setOpenModal(false);
                }}
                className={styles.closeicon}
              >
                <CloseIcon sx={{ color: "black" }} />
              </IconButton>
            </div>
          </Dialog>

          {/* ))} */}

          {/* {allProviderBookingList?.data?.length > 0 && (
            <Stack className={styles.paginationmainone} spacing={2}>
              <Pagination
                count={allProviderBookingList?.pages}
                variant="outlined"
                color="primary"
                page={page}
                onChange={handlePageChange}
              />
            </Stack>
          )} */}
        </section>
      </div>
    </DashboardWrapper>
  );
};

export default BookingHistory;
