import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useState, useEffect } from "react";
import styles from "@/styles/service/reports.module.scss";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { MobileDatePicker } from "@mui/x-date-pickers";
import assest from "@/json/assest";
import { Box, Grid, IconButton, InputAdornment } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import assets from "@/json/assest";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useReportList, useCountReportList } from "@/hooks/useReports";
import { useServiceTechnicianList } from "@/hooks/useTechnicianFeedback";
import { useQuery } from "react-query";
import { Cookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getProfileDetails } from "@/reduxtoolkit/profile.slice";
import moment from "moment";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function index() {
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();
  const [startValues, setStartValues] = useState(null);
  const [endValues, setEndValues] = useState(null);
  const [selectService, setSelectService] = useState(null);
  const router = useRouter();

  // fetch technician id using cookies
  const cookie = new Cookies();
  //let userDetails = cookie.get("userDetails");

  const { getProfileData } = useSelector((store) => store.profile);
  const startOfMonth = moment().subtract(30, "days").calendar();

  const endOfMonth = moment().format("YYYY-MM-DD");

  //Service Booking
  const { data: reportData } = useReportList({
    service_id: selectService === "" ? null : selectService,
    start_date: startValues || startOfMonth,
    end_date: endValues || endOfMonth,
  });

  // count Report
  const { data: countReportData } = useCountReportList({
    service_id: selectService === "" ? null : selectService,
    start_date: startValues || startOfMonth,
    end_date: endValues || endOfMonth,
  });

  // service/technician/list
  const { data: technicianServiceList } = useQuery(
    ["serviceTechnicianList", getProfileData?._id],
    () => useServiceTechnicianList(getProfileData?._id)
  );

  const handleSelectChange = (e) => {
    setSelectService(e.target.value);
  };

  const [mappedGraphs, setMappedGraphs] = useState([]);

  const [mappedSeries, setMappedSeries] = useState({});

  // 2nd count chart
  const [mappedCountDate, setMappedCountDate] = useState({});
  const [mappedNumberBooking, setMappedNumberBooking] = useState({});

  useEffect(() => {
    dispatch(getProfileDetails());
  }, []);

  // Service booking

  useEffect(() => {
    if (!!reportData && !!reportData?.data) {
      setMappedGraphs(
        reportData?.data?.booking_date?.map((chart) => {
          return chart;
        })
      );
    } else {
      setMappedGraphs([]);
    }
  }, [reportData]);

  useEffect(() => {
    if (!!reportData && !!reportData?.data) {
      setMappedSeries(
        reportData?.data?.service_booking?.map((service) => {
          return service;
        })
      );
    } else {
      setMappedSeries([]);
    }
  }, [reportData]);

  // count report chart
  useEffect(() => {
    if (!!countReportData && !!countReportData?.data) {
      setMappedCountDate(
        countReportData?.data?.booking_date?.map((service) => {
          return service;
        })
      );
    } else {
      setMappedCountDate([]);
    }
  }, [countReportData]);

  useEffect(() => {
    if (!!countReportData && !!countReportData?.data) {
      setMappedNumberBooking(
        countReportData?.data?.servicecount?.map((service) => {
          return service;
        })
      );
    } else {
      setMappedNumberBooking([]);
    }
  }, [countReportData]);

  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: true,
        tools: {
          zoomin: false,
          zoomout: false,
          zoom: false,
          pan: false,
          reset: false,
          download: '<img src="/assets/images/down-arrow.svg" width="20">',
        },
      },
      export: {
        csv: {
          filename: undefined,
          columnDelimiter: ",",
          headerCategory: "category",
          headerValue: "value",
          dateFormatter(timestamp) {
            return new Date(timestamp).toDateString();
          },
        },
        svg: {
          filename: undefined,
        },
        png: {
          filename: undefined,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
    },
    xaxis: {
      labels: {
        format: "dd/MM",
      },
      type: "datetime",
      categories: mappedGraphs || [],
      // [
      //   "2018-09-19T00:00:00.000Z",
      //   "2018-09-19T01:30:00.000Z",
      //   "2018-09-19T02:30:00.000Z",
      //   "2018-09-19T03:30:00.000Z",
      //   "2018-09-19T04:30:00.000Z",
      //   "2018-09-19T05:30:00.000Z",
      //   "2018-09-19T06:30:00.000Z",
      // ],
    },
    colors: [
      function ({ value, seriesIndex, w }) {
        if (value < 100) {
          return "#CD5C5C";
        } else {
          return "#F08080";
        }
      },
      function ({ value, seriesIndex, w }) {
        if (value < 700) {
          return "#FA8072";
        } else {
          return "#E9967A";
        }
      },
    ],

    colors: [
      "#33b2df",
      "#546E7A",
      "#d4526e",
      "#13d8aa",
      "#A5978B",
      "#2b908f",
      "#f9a3a4",
      "#90ee7e",
      "#f48024",
      "#69d2e7",
    ],
    stroke: {
      curve: "smooth",
    },

    noData: {
      text: "No data found",
      align: "center",
      verticalAlign: "middle",
    },

    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };
  // 2nd countpart chart
  const optionsChart = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: true,
        tools: {
          zoomin: false,
          zoomout: false,
          zoom: false,
          pan: false,
          reset: false,
          download: '<img src="/assets/images/down-arrow.svg" width="20">',
        },
      },
      export: {
        csv: {
          filename: undefined,
          columnDelimiter: ",",
          headerCategory: "category",
          headerValue: "value",
          dateFormatter(timestamp) {
            return new Date(timestamp).toDateString();
          },
        },
        svg: {
          filename: undefined,
        },
        png: {
          filename: undefined,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
    },
    xaxis: {
      labels: {
        format: "dd/MM",
      },
      type: "datetime",
      categories: mappedCountDate || [],
    },
    colors: [
      function ({ value, seriesIndex, w }) {
        if (value < 100) {
          return "#CD5C5C";
        } else {
          return "#F08080";
        }
      },
      function ({ value, seriesIndex, w }) {
        if (value < 700) {
          return "#FA8072";
        } else {
          return "#E9967A";
        }
      },
    ],

    colors: [
      "#33b2df",
      "#546E7A",
      "#d4526e",
      "#13d8aa",
      "#A5978B",
      "#2b908f",
      "#f9a3a4",
      "#90ee7e",
      "#f48024",
      "#69d2e7",
    ],
    stroke: {
      curve: "smooth",
    },

    noData: {
      text: "No data found",
      align: "center",
      verticalAlign: "middle",
    },

    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  return (
    <DashboardWrapper headerType="search" page="service">
      <div className={styles.mainwraper}>
        <div className="container">
          <div className={styles.heading_top}>
            <h3
              onClick={() => router.push("/service/dashboard")}
              className="headingH3"
            >
              <KeyboardBackspaceIcon /> Reports
            </h3>
            <h3>Service Date V/s Service Price</h3>
            <div className={styles.service_input}>
              <select
                value={selectService}
                onChange={handleSelectChange}
                name="list"
              >
                <option value="">All Services</option>
                {technicianServiceList?.data?.data?.length > 0 ? (
                  technicianServiceList?.data?.data?.length &&
                  technicianServiceList?.data?.data.map((item, i) => {
                    return (
                      <>
                        <option
                          value={item?._id}
                          key={i}
                          style={{
                            color: item?.isDeleted == true ? "red" : "#000000",
                          }}
                          select={item?.title}
                        >
                          {item?.title}
                        </option>
                      </>
                    );
                  })
                ) : (
                  <option disabled value={""}>
                    No Service{" "}
                  </option>
                )}
              </select>
            </div>
          </div>
          <div className={styles.date}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                name="start_date"
                value={startValues || startOfMonth}
                onChange={(newValue) => {
                  setStartValues(newValue.format("YYYY-MM-DD"));
                }}
                inputFormat="YYYY-MM-DD "
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
            {/* <input type="date"/> */}
            <p>To</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                name="end_date"
                value={endValues || endOfMonth}
                onChange={(newValue) => {
                  setEndValues(newValue.format("YYYY-MM-DD"));
                }}
                inputFormat="YYYY-MM-DD "
                disableFuture
                renderInput={(params) => (
                  <TextField
                    // helperText={invalid ? error.message : null}
                    placeholder="Select End date"
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
            {/* <input type="date"/> */}
          </div>

          {/* <div className={styles.graff_img}>
              <Image src={assets.graff} alt="img" width={1200} height={443} />
            </div> */}

          <div id="chart" className={styles.menu_download}>
            {typeof window !== "undefined" && (
              <ReactApexChart
                type="area"
                options={options}
                series={mappedSeries}
                height={350}
              />
            )}
          </div>

          <div className={styles.graph}>
            <h3 style={{ textAlign: "center" }}>
              Service Date V/s No. of Service Booked
            </h3>
            <div className={styles.menu_download_second_chart}>
              {typeof window !== "undefined" && (
                <ReactApexChart
                  type="area"
                  options={optionsChart}
                  series={mappedNumberBooking}
                  height={350}
                />
              )}
            </div>
          </div>
          {/* <div className={styles.download_chart}>
              <Image src={assets.download} alt="img" width={20} height={18} />
              <p>Download Chart</p>
            </div> */}
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default index;
