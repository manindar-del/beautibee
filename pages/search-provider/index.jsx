import React, { useEffect } from "react";
import { useState } from "react";
import assest from "@/json/assest";
import dynamic from "next/dynamic";
import { Button, Rating } from "@mui/material";
import Image from "next/image";
import styles from "@/styles/pages/searchlisting.module.scss";
import Grid from "@mui/material/Grid";
import axiosInstance from "axiosInstance";
import axios from "axios";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import ServiceBookModal from "@/components/ServiceBookModal";
import {
  useCreateServiceAdd,
  useGetAllServiceSearchList,
  useGetListServiceListingSubmit,
  useGetAllServiceList,
  useBookingConfirm,
} from "@/hooks/useSearchListing";
import { getProfileDetails } from "@/reduxtoolkit/profile.slice";

import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { toHoursAndMinutes } from "@/lib/functions/_common.lib";
import { Cookies } from "react-cookie";
import { useRouter } from "next/router";
import { Chip, Divider, Pagination, Stack } from "@mui/material";
import { GetMapAutoComplete } from "API/functions/map";
import Autocomplete from "react-google-autocomplete";
import { usePlacesWidget } from "react-google-autocomplete";
import TextField from "@mui/material/TextField";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const schema = yup.object({});

export async function getServerSideProps({ query }) {
  const search_titles = query.search_title || null;
  const latitudes = query.latitude || null;

  const longitudes = query.longitude || null;

  return {
    props: {
      search_titles,
      latitudes,
      longitudes,
    },
  };
}

const RatingList = [
  {
    value: 1,
    label: 1,
  },
  {
    value: 2,
    label: 2,
  },
  {
    value: 3,
    label: 3,
  },
  {
    value: 4,
    label: 4,
  },
  {
    value: 5,
    label: 5,
  },
];

const distances = [
  {
    value: 5,
    label: 5,
  },

  {
    value: 10,
    label: 10,
  },
  {
    value: 20,
    label: 20,
  },
  {
    value: 30,
    label: 30,
  },
  {
    value: 40,
    label: 40,
  },
  {
    value: 50,
    label: 50,
  },
  {
    value: 200,
    label: "50 & above",
  },
];

function Index({ search_titles, latitudes, longitudes }) {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [openModal, setOpenModal] = useState(false);
  const cookie = new Cookies();
  const token = cookie.get("token");
  const userDetails = cookie.get("userDetails");

  const router = useRouter();
  const [date, setDate] = useState(null);

  const [selectSlot, setSelectSlot] = useState("afternoon");
  const [selectHour, setSelectHour] = useState("");
  const [page, setPage] = useState(1);
  const [technicianID, setTechnicianId] = useState("");
  const [technicaianDetails, setTechnicaianDetails] = useState(null);
  const [getCurrentLocation, setgetCurrentLocation] = useState();
  const [timeSlot, setTimeSlot] = useState(false);

  const [providerID, setProviderId] = useState("");

  const { isProfileLoading, getProfileData } = useSelector(
    (store) => store.profile
  );
  


  

  const {  data:paymentDetails, mutate: bookingConfirm, isLoading, isSuccess:bookingConfirmSuccess } = useBookingConfirm();


  



  const [userData, setUser] = useState({});
  const [currentLong, setCurrentLong] = useState("");
  const [currentLat, setCurrentLat] = useState("");
  const [street, setStreet] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const [country_code, setCountryCode] = useState("375");

  const [DataAdd, setDataAdd] = useState([]);

  const [distance, setDistance] = useState();

  const [currentLocationLat, setCurrentLocationLat] = useState();

  const [currentLocationLong, setCurrentLocationLong] = useState();
  

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // All service list and search wise list using query string

  var allServiceSearchList;

 
  if (
    latitudes !== undefined &&
    longitudes !== undefined &&
    search_titles !== null
  ) {
    var {
      data: allServiceSearchList,
      mutate: serviceMutate,
      fetchNextPage,
      hasNextPage,
      refetch,
      isFetchingNextPage,
    } = useGetAllServiceSearchList({
      latitude: latitudes === "undefined" ? currentLocationLat : latitudes,
      longitude: longitudes === "undefined" ? currentLocationLong : longitudes,
      // rating: 2,
      // price: 200,
      // badge_id: 0,
      pagination_page: page,
      pagination_per_page: 5,
      customer_id: getProfileData?._id,
      maxDistance: 5,
      search_title: search_titles,
    });
  } else if (search_titles !== null) {
    var {
      data: allServiceSearchList,
      mutate: serviceMutate,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch,
    } = useGetAllServiceSearchList({
      latitude: currentLocationLat,
      longitude: currentLocationLong,
      pagination_page: page,
      pagination_per_page: 5,
      customer_id: getProfileData?._id,
      maxDistance: 5,
      search_title: search_titles,
    });
  } else {
    var {
      data: allServiceSearchList,
      mutate: serviceMutate,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch,
    } = useGetAllServiceSearchList({
      latitude: currentLocationLat,
      longitude: currentLocationLong,
      // rating: 2,
      // price: 200,
      // badge_id: 0,
      pagination_page: page,
      pagination_per_page: 5,
      customer_id: getProfileData?._id,
      maxDistance: 5,
      // search_title: search_titles,
    });
  }

  const { mutate: createServiceBooking } = useCreateServiceAdd();

  // top search bar show result functionality
  const { data: allServiceSearchLists, mutate: searchListingSubmit } =
    useGetListServiceListingSubmit();




  const submitData = (data) => {
    if (!watch("address")) {
      searchListingSubmit({
        ...data,
        rating: Number(data.rating),
        latitude: currentLocationLat,
        longitude: currentLocationLong,
        customer_id: userDetails?.data?._id,
        maxDistance: Number(data.maxDistance),
        pagination_page: page,
        pagination_per_page: 5,
        search_title: data.search_title,
      });
    } else {
      searchListingSubmit({
        ...data,
        rating: Number(data.rating),
        customer_id: userDetails?.data?._id,
        maxDistance: Number(data.maxDistance),
        pagination_page: page,
        pagination_per_page: 5,
        search_title: data.search_title,
      });
    }
  };

  const handlePageChange = (event, pageValue) => {
    setPage(pageValue);
  };
  /**
   * It sets the state of the data to the dayStr.
   */
  const showDetailsHandle = (dayStr) => {
    setTimeSlot(false);
    setDate(dayStr);
  };

  /**
   * The above function is a function that is called when an image fails to load.
   */
  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };
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

  // const getAddress = (value) => {
  //   console.log(country_code, "value");
  //   if (country_code != "") {
  //     axios
  //       .get(
  //         `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value},${country_code},&key=AIzaSyCSswYVKOUhmYxS_AzPROhWKOmgcAYDsnA`
  //       )
  //       .then((res) => {
  //         console.log("test", res);
  //         setDataAdd(res?.data?.predictions);
  //       })
  //       .catch((err) => {
  //         console.log("Address Error", err);
  //       });
  //   }
  //   //GetMapAutoComplete()
  // };

  useEffect(() => {
    if (getProfileData) {
      setUser(getProfileData);
      setCountryCode(
        getProfileData?.country_code == ""
          ? country_code
          : getProfileData?.country_code
      );
    }
  }, [getProfileData]);

  const handleSelect_current_location = async (value) => {
    let city = "";
    let county = "";
    let zipcode = "";
    //get state
    let state = "";
    setValue("address", value);
    geocodeByAddress(value)
      .then((results) => {
        // get city

        return getLatLng(results[0]);
      })
      .then((latLng) => {
        setValue("latitude", latLng?.lat);
        setValue("longitude", latLng?.lng);
      })
      //.then(latLng => console.log('Success', latLng))
      .catch((error) => {});
  };

  React?.useEffect(() => {}, [watch("lat"), watch("long")]);


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
    <DashboardWrapper page="user">
      <div className={styles.search_lising_page}>
        <div className={styles.search_header}>
          <div className={styles.filter_bar}>
            <div className={styles.bar_inner}>
              <div className={styles.filter_inner}>
                <div className={styles.loaction_btn}>
                  <div className={styles.loaction_btn_location}>
                    <Controller
                      control={control}
                      name="address"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <PlacesAutocomplete
                          name="address"
                          value={value}
                          onChange={onChange}
                          onSelect={handleSelect_current_location}
                          searchOptions={{
                            types: ["address"],
                            // componentRestrictions: { country: ["us"] },
                          }}
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                          }) => (
                            <div>
                              <TextField
                                name="address"
                                onClick={handleClick}
                                {...getInputProps({
                                  placeholder: "Address",
                                })}
                                disabled
                              />

                              <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion, i) => {
                                  const className = suggestion.active
                                    ? "suggestion-item--active"
                                    : "suggestion-item";
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                    ? {
                                        backgroundColor: "#fafafa",
                                        cursor: "pointer",
                                      }
                                    : {
                                        backgroundColor: "#ffffff",
                                        cursor: "pointer",
                                      };
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                      })}
                                      key={i}
                                    >
                                      <span className="text-start">
                                        {suggestion.description}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                      )}
                    />

                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Typography sx={{ p: 2 }}>
                        <Controller
                          control={control}
                          name="address"
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
                            <PlacesAutocomplete
                              name="address"
                              value={value}
                              onChange={onChange}
                              onSelect={handleSelect_current_location}
                              searchOptions={{
                                types: ["address"],
                                // componentRestrictions: { country: ["us"] },
                              }}
                            >
                              {({
                                getInputProps,
                                suggestions,
                                getSuggestionItemProps,
                                loading,
                              }) => (
                                <div>
                                  <TextField
                                    name="address"
                                    label="Address"
                                    {...getInputProps({
                                      placeholder: "Address",
                                    })}
                                  />

                                  <div className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion, i) => {
                                      const className = suggestion.active
                                        ? "suggestion-item--active"
                                        : "suggestion-item";
                                      // inline style for demonstration purpose
                                      const style = suggestion.active
                                        ? {
                                            backgroundColor: "#fafafa",
                                            cursor: "pointer",
                                          }
                                        : {
                                            backgroundColor: "#ffffff",
                                            cursor: "pointer",
                                          };
                                      return (
                                        <div
                                          {...getSuggestionItemProps(
                                            suggestion,
                                            {
                                              className,
                                              style,
                                            }
                                          )}
                                          key={i}
                                        >
                                          <span className="text-start">
                                            {suggestion.description}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </PlacesAutocomplete>
                          )}
                        />
                      </Typography>
                    </Popover>
                  </div>
                  <Image src={assest.GPS} alt="img" width={20} height={20} />
                </div>
              </div>
              <div className={styles.filter_inner}>
                <div className={styles.rating_btn}>
                  <div>
                    <div className={styles.rating_btn_sec}>
                      <Image
                        src={assest.downArrow}
                        alt="img"
                        width={20}
                        height={20}
                      />

                      <select {...register("rating")}>
                        <option value={""}>Select Rating</option>
                        {RatingList.map((item, i) => (
                          <option key={i} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className={styles.filter_inner}>
                <div className={styles.rating_btn}>
                  <div>
                    <div className={styles.rating_btn_sec}>
                      <input
                        type="text"
                        placeholder="Price"
                        {...register("price")}
                      />
                    </div>
                  </div>
                </div>
              </div> */}
              <div className={styles.filter_inner}>
                <div className={styles.rating_btn}>
                  <div>
                    <input
                      type="text"
                      placeholder="Expertise"
                      {...register("search_title")}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.filter_inner}>
                <div className={styles.rating_btn}>
                  <div>
                    <div className={styles.rating_btn_sec}>
                      <Image
                        src={assest.downArrow}
                        alt="img"
                        width={20}
                        height={20}
                      />

                      <select {...register("maxDistance")}>
                        <option value={""}>Select Distance </option>
                        {distances?.map((item, i) => (
                          <option
                            key={i}
                            value={item.value}
                            selected={item.value === 5}
                          >
                            {item.label+ "\n Miles"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.filter_inner}>
                <Button
                  className={styles.search_btn}
                  onClick={handleSubmit(submitData)}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            minHeight: allServiceSearchLists?.data?.length ? "100%" : "500px",
          }}
          className={styles.search_listing_body}
        >
          <div className="container">
            <Grid container spacing={2}>
              <Grid item md={6} sm={12} xs={12} className={styles.left_listing}>
                <h5>Result</h5>
                <ul>
                  {allServiceSearchLists?.data ? (
                    allServiceSearchLists?.data?.length > 0 ? (
                      allServiceSearchLists?.data?.map((item, index) => {
                        return (
                          <li key={index}>
                            <div className={styles.img_sec}>
                              <figure>
                                {item?.business_image ? (
                                  <>
                                    <img
                                      src={`${mediaPath}/uploads/user/business_image/${item?.business_image}`}
                                      alt="img"
                                      width={100}
                                      height={100}
                                      layout="responsive"
                                      onError={onErrorImg}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Image
                                      src={assest.noImage}
                                      alt="img"
                                      width={100}
                                      height={100}
                                      layout="responsive"
                                     
                                    />
                                  </>
                                )}
                              </figure>
                              <Button
                                className={styles.service_btn}
                                onClick={() => {
                                  if (
                                    token?.length === null ||
                                    token === undefined
                                  ) {
                                    router.push("/login");
                                  } else {
                                    router.push(
                                      `/user/dashboard/serviceprovider/${item?._id}`
                                    );
                                  }
                                }}
                              >
                                See all services
                              </Button>
                            </div>
                            <div className={styles.text_sec}>
                              <div className={styles.user_portion}>
                                <img
                                  src={`${mediaPath}/uploads/user/business_image/${item?.profile_image}`}
                                  alt="img"
                                  width={50}
                                  height={50}
                                  onError={onErrorImg}
                                />

                                <div className={styles.user_text}>
                                  <h6>{item?.full_name}</h6>
                                  <p>
                                    {item?.business_name !== ""
                                      ? item?.business_name
                                      : "NA"}
                                  </p>
                                  <div className={styles.star_sec}>
                                    <Rating
                                      name="read-only"
                                      value={item?.rating}
                                      readOnly
                                    />
                                    <h6>
                                      {item?.rating}
                                      <p>({item?.total_count})</p>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.time_slot}>
                                {item?.service_info?.map((serviceItem, i) => (
                                  <div className={styles.slot_inner} key={i}>
                                    <div className={styles.first_sec}>
                                      <h5>
                                        {" "}
                                        {serviceItem?.title}(
                                        {serviceItem?.duration} mins)
                                      </h5>
                                    </div>
                                    <div className={styles.second_sec}>
                                      <h5>
                                        ${serviceItem?.price?.toLocaleString()}
                                      </h5>
                                      <h6>
                                        {toHoursAndMinutes(
                                          serviceItem?.duration
                                        )}
                                      </h6>
                                    </div>
                                    <div className={styles.third_sec}>
                                      <Button
                                        // className={styles.book_btn}
                                        className={
                                          serviceItem?.isBooking
                                            ? styles.disabled
                                            : styles.book_btn
                                        }
                                        onClick={() => {
                                          if (
                                            token?.length === null ||
                                            token === undefined
                                          ) {
                                            router.push("/login");
                                          } else {
                                            setOpenModal(true);
                                            setTechnicianId(item?._id);
                                            createServiceBooking({
                                              service_id: serviceItem?._id,
                                            });
                                           
                                            setTechnicaianDetails(item);
                                          }
                                        }}
                                        disabled={serviceItem?.isBooking}
                                      >
                                        {serviceItem?.isBooking
                                          ? "Booked"
                                          : "Book"}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <div>No Service found</div>
                    )
                  ) : allServiceSearchList?.data?.length > 0 ? (
                    allServiceSearchList?.data?.map((item, index) => {
                      return (
                        <li key={index}>
                          <div className={styles.img_sec}>
                            <figure>
                              {item?.business_image ? (
                                <>
                                  <img
                                    src={`${mediaPath}/uploads/user/business_image/${item?.business_image}`}
                                    alt="img"
                                    width={100}
                                    height={100}
                                    layout="responsive"
                                    onError={onErrorImg}
                                  />
                                </>
                              ) : (
                                <>
                                  <Image
                                    src={assest.listImg}
                                    alt="img"
                                    width={100}
                                    height={100}
                                    layout="responsive"
                                  />
                                </>
                              )}
                            </figure>
                            <Button
                              className={styles.service_btn}
                              onClick={() => {
                                if (
                                  token?.length === null ||
                                  token === undefined
                                ) {
                                  router.push("/login");
                                } else {
                                  router.push(
                                    `/user/dashboard/serviceprovider/${item?._id}`
                                  );
                                  // router.push({
                                  //   pathname: `/user/dashboard/serviceprovider/${item?._id}`,
                                  //   query: {
                                  //     name: item?.full_name,
                                  //     image: item?.profile_image,
                                  //     status: item?.status,
                                  //   },
                                  // });
                                }
                              }}
                            >
                              See all services
                            </Button>
                          </div>
                          <div className={styles.text_sec}>
                            <div className={styles.user_portion}>
                              {/* <img
                                src={`${mediaPath}/uploads/user/business_image/${item?.profile_image}`}
                                alt="img"
                                width={50}
                                height={50}
                                onError={onErrorImg}
                              /> */}

                              <div className={styles.user_text}>
                                <h6>{item?.full_name}</h6>
                                <p>
                                  {item?.business_name !== ""
                                    ? item?.business_name
                                    : "NA"}
                                </p>
                                <div className={styles.star_sec}>
                                  <Rating
                                    name="read-only"
                                    value={item?.rating}
                                    readOnly
                                  />
                                  <h6>
                                    {item?.rating}
                                    <p>({item?.total_count})</p>
                                  </h6>
                                </div>
                              </div>
                            </div>
                            <div className={styles.time_slot}>
                              {item?.service_info?.map((serviceItem, i) => (
                                <div className={styles.slot_inner} key={i}>
                                  <div className={styles.first_sec}>
                                    <h5>
                                      {" "}
                                      {serviceItem?.title}(
                                      {serviceItem?.duration} mins)
                                    </h5>
                                  </div>
                                  <div className={styles.second_sec}>
                                    <h5>
                                      ${serviceItem?.price?.toLocaleString()}
                                    </h5>
                                    <h6>
                                      {toHoursAndMinutes(serviceItem?.duration)}
                                    </h6>
                                  </div>
                                  <div className={styles.third_sec}>
                                    <Button
                                      // className={styles.book_btn}
                                      className={
                                        serviceItem?.isBooking || serviceItem?.isTemporaryBooking
                                          ? styles.disabled
                                          : styles.book_btn
                                      }
                                      onClick={() => {
                                        if (
                                          token?.length === null ||
                                          token === undefined
                                        ) {
                                          router.push("/login");
                                        } else {
                                          setOpenModal(true);
                                          setTechnicianId(item?._id);
                                          createServiceBooking({
                                            service_id: serviceItem?._id,
                                          });
                                            
                                          
                                          setTechnicaianDetails(item);
                                        }
                                      }}
                                      disabled={serviceItem?.isBooking || serviceItem?.isTemporaryBooking}
                                    >
                                      {serviceItem?.isBooking ||  serviceItem?.isTemporaryBooking
                                        ? "Booked"
                                        : "Book"}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <div>No Service found</div>
                  )}

                  {allServiceSearchLists?.data
                    ? allServiceSearchLists?.data?.length > 0 && (
                        <Stack className={styles.paginationmainone} spacing={2}>
                          <Pagination
                            count={allServiceSearchLists?.pages}
                            variant="outlined"
                            color="primary"
                            page={page}
                            onChange={handlePageChange}
                          />
                        </Stack>
                      )
                    : allServiceSearchList?.data?.length > 0 && (
                        <Stack className={styles.paginationmainone} spacing={2}>
                          <Pagination
                            count={allServiceSearchList?.pages}
                            variant="outlined"
                            color="primary"
                            page={page}
                            onChange={handlePageChange}
                          />
                        </Stack>
                      )}
                </ul>
              </Grid>

              <Grid item md={6} sm={12} xs={12} className={styles.right_map}>
                <Map
                  numberData={allServiceSearchLists?.data?.length}
                  allServiceSearchList={allServiceSearchList}
                  getCurrentLocation={getCurrentLocation}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </div>

      <ServiceBookModal
        showDetailsHandle={showDetailsHandle}
        setOpen={setOpenModal}
        open={openModal}
        setSelectSlot={setSelectSlot}
        setSelectHour={setSelectHour}
        selectHour={selectHour}
        technicianID={technicianID}
        date={date}
        selectSlot={selectSlot}
        technicaianDetails={technicaianDetails}
        setTechnicaianDetails={setTechnicaianDetails}
        timeSlot={timeSlot}
        setTimeSlot={setTimeSlot}
        latitude = {currentLocationLat}
        longitude = {currentLocationLong}
        clientSecret ={paymentDetails?.data?.clientSecret}
        refetch={refetch}
        
      />
    </DashboardWrapper>
  );
}

export default Index;
