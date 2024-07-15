import React, { useEffect, useState, useMemo } from "react";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/pages/servicedetails.module.scss";
import assets from "@/json/assest";
import Box from "@mui/material/Box";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Link from "@/themes/overrides/Link";
import MyButton from "@/ui/Buttons/MyButton/MyButton";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import Rating from "@mui/material/Rating";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import {
  useGetAllServices,
  useGetServiceCategory,
  useGetAllServicesList,
} from "@/hooks/useService";
import {
  userTecnicianFavotites,
  fetchGetTechnicianList,
} from "@/hooks/useUserTechnicianFav";
import { useQuery, useInfiniteQuery } from "react-query";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import ServiceBookModal from "@/components/ServiceBookModal";
import { useCreateServiceAdd, useGetAllServiceSearchList, useBookingConfirm, useGetAllServiceList } from "@/hooks/useSearchListing";
import { Button } from "@mui/material";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });


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

function index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isProfileLoading, getProfileData } = useSelector(
    (store) => store.profile
  );
  const [list, setList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [categoryId, setCategoryId] = useState(null);
  const [date, setDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectSlot, setSelectSlot] = useState("afternoon");
  const [selectHour, setSelectHour] = useState("");
  const [technicianID, setTechnicianId] = useState("");
  const [technicaianDetails, setTechnicaianDetails] = useState(null);
  //console.log(technicaianDetails,"technicaianDetails");

  const [currentLocationLat, setCurrentLocationLat] = useState();
  //console.log(currentLocationLat,"currentLocationLat");

  const [currentLocationLong, setCurrentLocationLong] = useState();

  const [getCurrentLocation, setgetCurrentLocation] = useState();

  

  //console.log(categoryId, "categoryId");

  const [timeSlot, setTimeSlot] = useState(false);

  const [page, setPage] = useState(1);

  
  const userId = router.query.id;
  // current lat, long and maxdistance
  const maxDistances = 5;
  const latitudes = currentLocationLat;
  const longitudes = currentLocationLong;

  const {
    data: allServiceProviderList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch: allserviceProvider,
  } = useGetAllServices(
    categoryId,
    userId,
    maxDistances,
    latitudes,
    longitudes
  );

  const { data: allServiceCategory } = useGetServiceCategory();
  const { mutate: createServiceBooking } = useCreateServiceAdd();

  // get all  get technician details
  const { data: getListTechnician, refetch } = useQuery({
    queryFn: () =>
      fetchGetTechnicianList({
        user_id: router?.query?.id,
      }),
    queryKey: ["provider"],
    enabled: !!router?.query?.id,
  });

  //console.log(getListTechnician, "getListTechnician");
  // const handlePageChange = (event, pageValue) => {
  //   setPage(pageValue);
  // };

  const { data, mutate: userTechnicianFav } = userTecnicianFavotites();

  const [value, setValue] = useState(0);

  const [values, setValues] = useState(0);

  const [item, setItem] = useState(allServiceProviderList?.data);

  const ratingChanged = (newValue) => {
    setValues(newValue);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const {  data:paymentDetails, mutate: bookingConfirm, isLoading, isSuccess:bookingConfirmSuccess } = useBookingConfirm();






  const handleChangeFirst = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * A function that is called when a user clicks on the favorite button.
   */
  const userTechnicianFavs = (id) => {
    userTechnicianFav({
      technician_id: id,
      onSuccess: () => {
        refetch();
      },
    });
  };
 // get current location 
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;

        setgetCurrentLocation([latitude, longitude]);

        setCurrentLocationLat(latitude);
        setCurrentLocationLong(longitude);

        //setLocation({ latitude, longitude });
      });
    }
    setTimeout(() => {
      setgetCurrentLocation([37.0902, 95.7129]);
    }, 2000);
  }, []);

  /**
   * If the image fails to load, replace it with the noImage asset
   */
  const onErrorImg = (ev) => {
    ev.target.src = assets.noImage;
  };

  const showDetailsHandle = (dayStr) => {
    setTimeSlot(false);
    setDate(dayStr);
  };

  
  const {
    data: allServiceSearchLists,
    mutate: serviceMutate,
    refetch:searchList
  } = useGetAllServiceSearchList({
    latitude: currentLocationLat,
    longitude: currentLocationLong,
    pagination_page: page,
    pagination_per_page: 5,
    customer_id: getProfileData?._id,
    maxDistance: 5,
    
  });


  const { data: allServiceBookingList, isSuccess:successPayment } = useGetAllServiceList({
    provider_id: technicianID,
  });


useEffect(()=>{
  
  if(successPayment && allServiceBookingList?.data){

    const data = {
      provider_id: technicianID,
      amount: allServiceBookingList?.data?.total_price,
      currency:"usd",
      platform: "web",
    };
    bookingConfirm(data)


  }


},[successPayment, allServiceBookingList])





  return (
    <DashboardWrapper headerType="search" page="user">
      <div className="container">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <div className={styles.listing_sec}>
                <div className={styles.left_cont_sec}>
                  <img
                    src={`${mediaPath}/uploads/user/business_image/${getListTechnician?.data?.data.business_image}`}
                    alt="img"
                    width={158}
                    height={183}
                    onError={onErrorImg}
                    className={styles.imgbox}
                  />
                </div>
                <div className={styles.right_cont_sec}>
                  <h2>{getListTechnician?.data?.data?.full_name}</h2>
                  <h3>Professional</h3>
                  <h4>
                    Business name:{" "}
                    <span>{getListTechnician?.data?.data?.business_name}</span>
                  </h4>
                  <h5>
                    <Image
                      src={assets.instragram}
                      alt="img"
                      width={18}
                      height={18}
                    />{" "}
                    <p>{getListTechnician?.data?.data?.instagram_id}</p>
                  </h5>
                  <div className={styles.rating_box}>
                    {/* Rating show */}
                    <Rating
                      name="read-only"
                      value={parseInt(getListTechnician?.data?.data?.rating)}
                      readOnly
                    />
                    <h6>
                      {" "}
                      {getListTechnician?.data?.data?.rating}{" "}
                      <p>({getListTechnician?.data?.data?.total_count})</p>{" "}
                    </h6>
                  </div>
                  <div className={styles.share_wishlist}>
                    {/* Share Button */}
                    {/* <div className={styles.share_wishlist_btn}>
                      <button>
                        <Image
                          src={assets.share}
                          alt="img"
                          width={20}
                          height={9}
                        />
                      </button>
                    </div> */}
                    <div className={styles.share_wishlist_btn}>
                      <button
                        onClick={() =>
                          userTechnicianFavs(getListTechnician?.data?.data?._id)
                        }
                      >
                        <Image
                          src={
                            getListTechnician?.data?.data?.isFavorite
                              ? assets?.hearticonFill
                              : assets?.hearticon
                          }
                          width={10}
                          height={10}
                          style={{ cursor: "pointer" }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.description_sec}>
                <h2>Description</h2>
                <p>{getListTechnician?.data?.data?.business_info}</p>

              </div>
              <div className={styles.tab_bar}>
                {allServiceProviderList?.pages[0]?.data?.length === 0 &&
                categoryId === null ? (
                  <h3 style={{ textAlign: "center", margin: "65px" }}>
                    No Services
                  </h3>
                ) : (
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                      >
                        <Tab label="Services" {...a11yProps(0)} />
                        {/* <Tab label="Reviews" {...a11yProps(1)} />
                      <Tab label="About" {...a11yProps(2)} />  */}
                      </Tabs>
                    </Box>
                    {/* <TabPanel value={value} index={0}>  */}
                    <TabContext value={value}>
                      <div className={styles.tab_details}>
                        <Box>
                          <TabList
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                          >
                            <Tab
                              label={"All"}
                              {...a11yProps(0)}
                              onClick={() => {
                                setCategoryId(null);
                              }}
                            />

                            {allServiceCategory?.pages[0]?.data.map(
                              (item, i) => {
                                return (
                                  <Tab
                                    label={item?.title}
                                    {...a11yProps(i)}
                                    onClick={() => {
                                      setCategoryId(item?._id);
                                    }}
                                  />
                                );
                              }
                            )}
                          </TabList>
                        </Box>

                        {allServiceProviderList?.pages[0]?.data?.length > 0 ? (
                          allServiceProviderList?.pages[0]?.data?.map(
                            (items, i) => {
                              return (
                                <TabPanel
                                  className={styles.tabmainone}
                                  value={value}
                                  index={value}
                                  key={i}
                                >
                                  <div className={styles.content_sec}>
                                    <div className={styles.cuts_listing}>
                                      <h2>{items?.title}</h2>
                                      <p>{items?.description}</p>
                                      <p>{items?.category_info?.title}</p>
                                      {/* <button>More Info</button> */}
                                    </div>
                                    <MyButton
                                      onClick={() => {
                                        setOpenModal(true);
                                        setTechnicianId(router?.query?.id);
                                        createServiceBooking({
                                          service_id: items?._id,
                                        });
                                        setTechnicaianDetails(items);
                                      }}
                                      disabled={items?.isBooking || items?.isTemporaryBooking}
                                    >
                                      {items?.isBooking || items?.isTemporaryBooking ? "Booked": "Book Now"}
                                    </MyButton>
                                  </div>
                                </TabPanel>
                              );
                            }
                          )
                        ) : (
                          <h3 style={{ textAlign: "center", margin: "65px" }}>
                            No List
                          </h3>
                        )}
                      </div>
                    </TabContext>
                    {/* </TabPanel> */}

                    {/* <TabPanel value={value} index={1}>
                    Item Two 
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    Item Three
                  </TabPanel> */}
                  </Box>
                )}
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              {getListTechnician?.data?.data?.image_gallery?.length > 0 ? (
                <div className={styles.gallery_box}>
                  {getListTechnician?.data?.data?.image_gallery !== null ? (
                    getListTechnician?.data?.data?.image_gallery?.map(
                      (element, index) => {
                        return (
                          <img
                            key={index}
                            src={`${mediaPath}/uploads/user/image_gallery/${element}`}
                            alt="img"
                            width={176}
                            height={122}
                            onError={onErrorImg}
                          />
                        );
                      }
                    )
                  ) : (
                    <Image
                      src={assets.noImage}
                      alt="img"
                      width={111}
                      height={43}
                    />
                  )}
                </div>
              ) : (
                <h3 style={{ marginTop: "30px" }}> No Gallery Images Here</h3>
              )}
              <div className={styles.map}>

              <Map
                  numberData={allServiceSearchLists?.data?.length}
                  allServiceSearchList={allServiceSearchLists}
                  getCurrentLocation={getCurrentLocation}

                />
                {/* <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14736.281053276303!2d88.4306861!3d22.57647525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1669368668982!5m2!1sen!2sin"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe> */}
                {/* <h2></h2>
                <p>2301 Hillman Street Youngstown, OH 44511 3305595457</p> */}
                <MyButton
                className ={styles.map_button}
                  onClick={() => router.push(`//chat/${router?.query?.id}`)}
                  //             router.push({
                  //   pathname: `//chat/${user?.user_id}`,
                  //   query: {
                  //     name: user?.user_name,
                  //     image: user?.user_image,
                  //     status: user?.status,
                  //   },
                  // });
                >
                  <Image src={assets.chat} alt="img" width={130} height={130} />{" "}
                  Chat
                </MyButton>
              </div>
              {getListTechnician?.data?.data?.business_hours?.length > 0 ? (
                <div className={styles.hours}>
                  <h2>Business Hours</h2>
                  <table>
                    {getListTechnician?.data?.data?.business_hours?.map(
                      (item) => {
                        var splitTiming = item?.timing?.split("-");
                        return (
                          <tr>
                            <td>{item?.week_day} :</td>
                            <td>
                              {splitTiming[0]}-{splitTiming[1]}{" "}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </table>
                </div>
              ) : null}
            </Grid>
          </Grid>
        </Box>
        {hasNextPage && !isFetchingNextPage && (
          <button
            className={styles.loadmore}
            onClick={() => {
              fetchNextPage();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Load more
          </button>
        )}
      </div>

      <ServiceBookModal
        showDetailsHandle={showDetailsHandle}
        setOpen={setOpenModal}
        open={openModal}
        setSelectSlot={setSelectSlot}
        setSelectHour={setSelectHour}
        selectHour={selectHour}
        technicianID={technicianID}
        technicaianDetails={technicaianDetails?.user_info}
        setTechnicaianDetails={setTechnicaianDetails}
        date={date}
        selectSlot={selectSlot}
        timeSlot={timeSlot}
        setTimeSlot={setTimeSlot}
        allserviceProvider={allserviceProvider}
        latitude = {currentLocationLat}
        longitude = {currentLocationLong}
        clientSecret ={paymentDetails?.data?.clientSecret}
        searchList={searchList}
      />
    </DashboardWrapper>
  );
}
export default index;
