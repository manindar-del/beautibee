import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import assets from "@/json/assest";
import styles from "@/styles/pages/checkout.module.scss";
import { Box, Grid, Dialog, IconButton } from "@mui/material";
// import dayjs from 'dayjs';
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getToAllCartList } from "@/reduxtoolkit/cart.slice";
import  CreditCardForm  from "@/components/paymentOption";
import Tab from "@mui/material/Tab";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCheckoutPass,
  useGetAllCountry,
  useGetAllStateMutation,
} from "@/hooks/useCheckout";
import Cart from "./cart";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import { useRouter } from "next/router";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  getAddresValue,
  getAddresValues,
} from "../../../Components/serviceForm/_helpers";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {  useBookingConfirm} from "@/hooks/useSearchListing";


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
  const dispatch = useDispatch();
  const router = useRouter();
  const { getCartListData } = useSelector((state) => state?.cart);
  const { getProfileData } = useSelector((state) => state.profile);
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => setOpenModal(false);
  const [values, setValues] = useState(2);
  const [error, setError] = useState({});
  const [countrySelect, setCountrySelect] = useState("");
  const [citySelect, setCitySelect] = useState("");
  // google place states
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [addressSelect, setAddressSelect] = useState("");
  const [countryShort, setCountryShort] = useState("");
  const [statecode, setStatecode] = useState("");
  const [stateZip, setStateZip] = useState("");

  const [inputData, setInputData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const {
    mutate: createCheckout,
    data,
    isLoading,
    isSuccess,
    isError,
  } = useCheckoutPass();
  const { data: allCountryList } = useGetAllCountry();
  const { data: allStateList, mutate } = useGetAllStateMutation();

  const handleChange = (event, newValue) => {
    setValues(newValue);
  };



  const stripePromise = loadStripe('pk_test_51NC8juH8DTESxykdMLuQqFAyDY7Zr6bynV7U961EXoD0cufh8oiv3qb8mppMMixOe2dibNEIjBfpNgwqzpICEeg800YKxDHyj6');




  //inputfield onchange function
  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  // cart list & sum all items quantity and items total price
  let item = 0;
  let quantity = 0;
  let totalPrice = 0;
  let cartList = getCartListData?.data;

  for (item; item < cartList?.length; item++) {
    quantity = quantity + parseInt(cartList[item]?.quantity);
    totalPrice += parseInt(cartList[item]?.total_price);
  }

  useEffect(() => {
    dispatch(getToAllCartList());
  }, []);

  // validation all form fields
  const validation = () => {
    let error = {};
    if (!inputData.first_name) {
      error.first_name = "First Name is required";
    }

    if (!inputData.last_name) {
      error.last_name = "Last Name  is required";
    }

    if (!inputData.phone) {
      error.phone = "Phone number is required";
    } else if (inputData.phone.length > 10) {
      error.phone = "Maximum 10 characters";
    } else if (inputData.phone.length < 10) {
      error.phone = "minimum 10 characters";
    }

    if (!inputData.email) {
      error.email = "Email address is required";
    } else if (
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        inputData.email
      )
    ) {
      error.email = "Enter a valid email";
    }

    if (!stateZip) {
      error.stateZip = "Zipped Code Details is required";
    } else if (stateZip.length > 11) {
      error.stateZip = "Maximum 11 characters";
    }
    var array = stateZip.split("");
    if (array.indexOf(".") >= 0) {
      error.stateZip = " zipcode is not a decimal number";
    }
    if (!addressSelect) {
      error.addressSelect = "Address Details is required";
    }

    if (!countryShort) {
      error.countryShort = "Country is required";
    }

    if (!statecode) {
      error.statecode = "Street  Address can not be empty";
    }

    return error;
  };

  const handleSelectChange = (e) => {
    setCountryShort(e.target.value);
  };

  const handleSelectChangeCity = (e) => {
    setStatecode(e.target.value);
  };

  const handleSelectChangeZip = (e) => {
    setStateZip(e.target.value);
  };

  // google on handle function
  const handleSelect_current_location = async (value) => {
    let city = "";
    let countyShort = "";
    let county = "";
    let zipcode = "";
    //get state
    let state = "";
    setAddressSelect(value);
    geocodeByAddress(value)
      .then((results) => {
        // get city
        console.log(results, "results");
        //city =  getAddresValue(results[0]?.address_components, "locality");

        // get County
        county = getAddresValue(results[0]?.address_components, "country");

        // short name country
        countyShort = getAddresValues(
          results[0]?.address_components,
          "country"
        );

        //get state
        state = getAddresValue(
          results[0]?.address_components,
          "administrative_area_level_1"
        );
        setStatecode(state);

        zipcode = getAddresValue(results[0]?.address_components, "postal_code");

        return getLatLng(results[0]);
      })
      .then((latLng) => {
        setStateZip(zipcode);
        setLat(latLng?.lat);
        setLong(latLng?.lng);
        setCountryShort(countyShort);
      })
      .catch((error) => {
        console.log(error, "ERROR");
      });
  };

  //First check validation then payment card pop up open after fill up all card details checkout completed
  const add = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      setOpenModal(true);
    }
  };

  // get state dropdown using  country on selection
  useEffect(() => {
    setCountryShort(countryShort);
    mutate({
      location_type: "state",
      country_code: countryShort,
      state_code: "string",
    });
  }, [countryShort]);

  useEffect(() => {
    setStatecode(statecode);
  }, [statecode]);

  // Autofill first name, last name, email, phone
  useEffect(() => {
    if (getProfileData) {
      setInputData({
        first_name: getProfileData.first_name,
        last_name: getProfileData.last_name,
        email: getProfileData.email,
        phone: getProfileData.phone,
      });
    }
  }, [getProfileData]);

  // On successfully payment redirect to success payment page otherwise go paymentfailed
  // useEffect(() => {
  //   if (isSuccess) {
  //     router.push("/user/successPyment");
  //   } else if (isError) {
  //     router.push("/user/paymentFailed");
  //   }
  // }, [isSuccess]);


useEffect(()=>{
  if(totalPrice){

    const data = {
      amount: totalPrice,
      currency:"usd",
      platform: "web",
    };
    createCheckout(data)
  }
},[totalPrice])

const clientSecret = data?.data?.clientSecret;

  const appearance = {
    theme: "night",
  };
  
  const options = {
    clientSecret,
    appearance,
  };
  

  return (
    <DashboardWrapper headerType="search" page="user">
      <div className="container">
        <div className={styles.cart_full_wrapper}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item md={8} xs={12}>
                <div className={styles.cart_left_wrapper}>
                  <h4>Checkout</h4>
                  <div className={styles.checkout_listing}>
                    <div className={styles.contact_details}>
                      <h2>
                        Contact
                        {/* <span>Edit</span> */}
                      </h2>
                      <ul>
                        <>
                          <li>
                            <Link href={`mailhref:${getProfileData?.email}`}>
                              {getProfileData?.email}
                            </Link>
                          </li>
                          <li>
                            <Link href={`tel:${getProfileData?.phone}`}>
                              {getProfileData?.phone}
                            </Link>
                          </li>
                        </>
                      </ul>
                    </div>
                  </div>
                  <div className={styles.checkout_listing}>
                    <div className={styles.address_details}>
                      <h2>Address</h2>
                      <div className={styles.accountForm}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                              <div className={styles.formGroup}>
                                <label>First name *</label>
                                <TextField
                                  hiddenLabel
                                  id="filled-hidden-label-normal"
                                  // defaultValue="Jason"
                                  // variant="filled"
                                  name="first_name"
                                  onChange={postUserData}
                                  value={inputData.first_name}
                                />
                              </div>
                              <div className="error">{error.first_name}</div>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <div className={styles.formGroup}>
                                <label>Last name *</label>
                                <TextField
                                  hiddenLabel
                                  id="filled-hidden-label-normal"
                                  // defaultValue="Doyle"
                                  // variant="filled"
                                  name="last_name"
                                  onChange={postUserData}
                                  value={inputData.last_name}
                                />
                              </div>
                              <div className="error">{error.last_name}</div>
                            </Grid>
                            <Grid item md={12} xs={12}>
                              <div className={styles.formGroup}>
                                <label>Email *</label>
                                <TextField
                                  hiddenLabel
                                  id="filled-hidden-label-normal"
                                  // defaultValue="jasondoyle@gmail.com"
                                  variant="filled"
                                  type="email"
                                  name="email"
                                  onChange={postUserData}
                                  value={inputData.email}
                                />
                              </div>
                              <div className="error">{error.email}</div>
                            </Grid>
                            <Grid item md={12} xs={12}>
                              <div className={styles.formGroup}>
                                <label>Address *</label>

                                <PlacesAutocomplete
                                  name="address"
                                  value={addressSelect}
                                  onChange={(newValue) =>
                                    setAddressSelect(newValue)
                                  }
                                  onSelect={handleSelect_current_location}
                                  searchOptions={
                                    {
                                      // types: ["address"],
                                      // componentRestrictions: { country: ["us"] },
                                    }
                                  }
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
                                        label="address"
                                        {...getInputProps({
                                          placeholder: "address",
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
                              </div>
                              <div className="error">{error.addressSelect}</div>
                            </Grid>

                            <Grid item md={6} xs={12}>
                              <div className={styles.formGroup}>
                                <label>Pincode *</label>

                                <TextField
                                  type="number"
                                  name="pincode"
                                  onChange={handleSelectChangeZip}
                                  value={stateZip}
                                  placeholder="Enter pincode"
                                  disabled={!addressSelect}
                                />
                              </div>
                              <div className="error">{error.stateZip}</div>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <div className={styles.formGroup}>
                                <label>Phone number *</label>
                                <TextField
                                  hiddenLabel
                                  id="filled-hidden-label-normal"
                                  name="phone"
                                  onChange={postUserData}
                                  value={inputData.phone}
                                />
                              </div>
                              <div className="error">{error.phone}</div>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <div className={styles.formGroup}>
                                <label>Select Country *</label>

                                <select
                                  value={countryShort}
                                  onChange={handleSelectChange}
                                  name="country"
                                  disabled={!addressSelect}
                                >
                                  <option value={""}>Select Country</option>
                                  {allCountryList?.pages[0]?.data?.map(
                                    (item, i) => (
                                      <option
                                        value={item?.isoCode}
                                        key={i}
                                        selected={item.isoCode === countryShort}
                                      >
                                        {item.name}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                              <div className="error">{error.countryShort}</div>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <div className={styles.formGroup}>
                                <label>Select State *</label>

                                <select
                                  value={statecode}
                                  onChange={handleSelectChangeCity}
                                  name="city"
                                  disabled={!addressSelect}
                                >
                                  <option value={""}>Select State </option>
                                  {allStateList?.data?.map((item, i) => (
                                    <option
                                      value={item.name}
                                      key={i}
                                      selected={item.name === statecode}
                                    >
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="error">{error.statecode}</div>
                            </Grid>
                            <Grid item md={2} xs={12}>
                              {/* <div className={styles.formGroup}>
                         <button className={styles.btnSave}>Save</button>
                            </div> */}
                            </Grid>
                          </Grid>
                        </Box>
                      </div>
                    </div>
                  </div>
                  <div className={styles.checkout_listing}>
                    <TabContext value={values}>
                      <div className={styles.payment_details}>
                        <h2>Payment Method</h2>
                        <Box>
                          <TabList
                            value={values}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                          >
                            <Tab
                              label=""
                              {...a11yProps(0)}
                              icon={
                                <Image
                                  src={assets.amazon}
                                  alt="img"
                                  width={157}
                                  height={55}
                                />
                              }
                              disabled
                            />

                            <Tab
                              label=""
                              {...a11yProps(1)}
                              icon={
                                <Image
                                  src={assets.pay}
                                  alt="img"
                                  width={157}
                                  height={55}
                                />
                              }
                              disabled
                            />

                            <Tab
                              label=""
                              {...a11yProps(2)}
                              icon={
                                <Image
                                  src={assets.card}
                                  alt="img"
                                  width={157}
                                  height={55}
                                />
                              }
                              className={styles.active_tab}
                            />
                          </TabList>
                        </Box>
                      </div>
                    </TabContext>
                  </div>
                </div>
              </Grid>
              <Grid item md={4} xs={12}>
                <div className={styles.cart_right_wrapper}>
                  <h2>Cart Product</h2>
                  {getCartListData?.data?.length > 0 ? (
                    <>
                      {getCartListData?.data?.map((item, index) => (
                        <Cart
                          item={item}
                          getCartListData={
                            getCartListData?.data?.length
                              ? getCartListData?.data[index]?.quantity
                              : 0
                          }
                        />
                      ))}
                    </>
                  ) : (
                    <>..Loading</>
                  )}

                  <div className={styles.total_amount}>
                    <h2>Total</h2>
                    <ul>
                      <li>
                        <h3>Items</h3> <h4>{quantity}</h4>
                      </li>
                      {getCartListData?.data?.map((item, index) => (
                        <li>
                          <h3>Sub Total</h3>{" "}
                          <h4>
                            {item?.quantity} X {item?.product_info?.price}{" "}
                          </h4>
                        </li>
                      ))}
                      {/* <li>
                        <h3>Delivery</h3> <h4>$41.30</h4>
                      </li> */}
                      <li>
                        <h5>Grand Total</h5> <h6>{totalPrice}</h6>
                      </li>
                    </ul>
                  </div>
                  <button
                    className={styles.button_checkout}
                    type="button"
                    onClick={add}
                  >
                    Checkout
                  </button>
                  <div className={styles.we_accept}>
                    <p>We Accept</p>
                    <ul>
                      <li>
                        <Image
                          src={assets.payment1}
                          alt="img"
                          width={27}
                          height={35}
                        />
                      </li>
                      <li>
                        <Image
                          src={assets.payment2}
                          alt="img"
                          width={27}
                          height={35}
                        />
                      </li>
                      <li>
                        <Image
                          src={assets.payment3}
                          alt="img"
                          width={27}
                          height={35}
                        />
                      </li>
                      <li>
                        <Image
                          src={assets.payment4}
                          alt="img"
                          width={27}
                          height={35}
                        />
                      </li>
                      <li>
                        <Image
                          src={assets.payment5}
                          alt="img"
                          width={27}
                          height={35}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
        <Dialog
          open={openModal}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="checkout_modal"
          scroll={"body"}
        >
          <div className={styles.cross_sign}>
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
            <CreditCardForm
              totalPrice={totalPrice}
              isLoading={isLoading}
              createCheckout={createCheckout}
              // first_name={inputData.first_name}
              // last_name={inputData.last_name}
              // email={inputData.email}
              // phone={inputData.phone}
              // country={countrySelect}
              // state={citySelect}
              // pincode={inputData.pincode}
              // address={inputData.address}
              // country={countryShort}
              // state={statecode}
              // pincode={stateZip}
              // address={addressSelect}
              setOpenModal={setOpenModal}
              clientSecret={clientSecret}
            />
             </Elements>
          )}
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
      </div>
    </DashboardWrapper>
  );
}

export default index;
