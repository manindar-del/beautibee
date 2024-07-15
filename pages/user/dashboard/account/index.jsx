import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import { useEffect, useState } from "react";
import styles from "@/styles/pages/account.module.scss";
import Image from "next/image";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { IconButton, InputAdornment } from "@mui/material";
import assest from "@/json/assest";
import {
  getProfileDetails,
  updateProfileDetails,
} from "@/reduxtoolkit/profile.slice";
import { useDispatch, useSelector } from "react-redux";
// import moment from "moment/moment";
import { useSnackbar } from "notistack";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { regexFormat } from "@/json/regex/regexFormat";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  getAddresValue,
  getAddresValues,
} from "../../../../Components/serviceForm/_helpers";

import { useGetAllCountry, useGetAllStateMutation } from "@/hooks/useProfile";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en";

const Gender = [
  // {
  //   value: "NA",
  //   label: "NA",
  // },
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
  {
    value: "other",
    label: "Others",
  },
];

function Index() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isProfileLoading, getProfileData } = useSelector(
    (store) => store.profile
  );

  const [DOB, setDOB] = useState(null);
  const [genderSelect, setGenderSelect] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageOriginal, setProfileImageOriginal] = useState(null);
  const [countrySelect, setCountrySelect] = useState("");
  const [citySelect, setCitySelect] = useState("");
  const [error, setError] = useState({});

  // google place states
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const [addressSelect, setAddressSelect] = useState("");
  const [countryShort, setCountryShort] = useState("");
  const [statecode, setStatecode] = useState("");
  const [stateZip, setStateZip] = useState("");
  const [country, setCountry] = useState();
  //console.log(country, "country");

  const { data: countryList } = useGetAllCountry();

  const { data: allStateList, mutate } = useGetAllStateMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street: "",
    zipcode: "",
    description: "",
  });

  //inputfield onchange function
  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setProfileData({ ...profileData, [name]: value });
  };

  const [inputErrorData, setInputErrorData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    // street: "",
    // zipcode: "",
    profile_pic: "",
  });

  useEffect(() => {
    dispatch(getProfileDetails());
  }, [isLoading]);

  /* Get user profile details in edit */
  useEffect(() => {
    if (getProfileData !== undefined) {
      let temp = { ...profileData };
      temp["first_name"] = getProfileData?.first_name;
      temp["last_name"] = getProfileData?.last_name;
      temp["email"] = getProfileData?.email;
      temp["phone"] = getProfileData?.phone;
      // temp["street"] = getProfileData?.street;
      // temp["zipcode"] = getProfileData?.zipcode;
      temp["description"] = getProfileData?.description;
      setCountryShort(getProfileData?.country);
      setStatecode(getProfileData?.city);
      setProfileImageOriginal(getProfileData?.profile_image);
      setDOB(getProfileData?.date_of_birth);
      setAddressSelect(getProfileData?.street);
      setStateZip(getProfileData?.zipcode);
      setGenderSelect(getProfileData?.gender);
      setCountry(getProfileData?.country_code)

      setProfileData(temp);
    }
  }, [isLoading, getProfileData]);

  // const handleErrorRemove = (e) => {
  //   let temp = { ...inputErrorData };
  //   temp[e.target.name] = "";
  //   setInputErrorData(temp);
  // };

  const validation = () => {
    let error = {};
    if (!profileData?.first_name) {
      error.first_name = "Please Enter your first name";
    }

    if (!profileData?.last_name) {
      error.last_name = "Please Enter your Last name";
    }

    if (profileData?.first_name.length >= 250) {
      error.first_name = "Opps! you can not add more than 250 character";
    }

    if (regexFormat.name2.test(profileData?.first_name)) {
      error.first_name =
        "Opps! you can not add special character in first name";
    }
    if (profileData?.last_name.length >= 250) {
      error.last_name = "Opps! you can not add more than 250 character";
    }
    if (regexFormat.name2.test(profileData?.last_name)) {
      error.last_name = "Opps! you can not add special character in last name";
    }
    // if (profileData?.email === "") {
    //   temp.email = "Email can not be empty";
    //   isError = true;
    // }

    if (!profileData.phone) {
      error.phone = "Phone number is required";
    } else if (profileData.phone.length > 10) {
      error.phone = "Maximum 10 characters";
    } else if (profileData.phone.length < 10) {
      error.phone = "minimum 10 characters";
    }
    var array = profileData.phone.split("");
    if (array.indexOf(".") >= 0) {
      error.phone = "Phone number is not a decimal number";
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
      error.addressSelect = "Location Details is required";
    }

    if (!countryShort) {
      error.countryShort = "Country is required";
    }

    if(!country || country === undefined){
      error.country = "Country Code is required";
    }

    if (!statecode) {
      error.statecode = "Street  Address can not be empty";
    }

    return error;
  };
  const handleFieldChange = (e) => {
    const temp = { ...profileData };
    let isError = validate();
    if (!isError) {
      temp[e.target.name] = e.target.value;
      setProfileData(temp);
      setInputErrorData({
        first_name: "",
        last_name: "",
        phone: "",
        street: "",
        zipcode: "",
      });
    } else {
      temp[e.target.name] = e.target.value;
      setProfileData(temp);
    }
  };
  // upload images with  type image conditions
  const handleProfileImage = (e) => {
    if (
      e.target.files[0]?.type === "image/jpeg" ||
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpg"
    ) {
      if (e.target.files[0]?.size <= 3000000) {
        setProfileImage(e.target.files[0]);
      } else {
        enqueueSnackbar("Please uplod image of proper size.", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please uplod image of proper format.", {
        variant: "error",
      });
    }
  };
  //  handle edit image
  const handleEditPimage = () => {
    let formData = new FormData();
    formData.append("profile_image", profileImage);
    dispatch(updateProfileDetails(formData))
      .then((res) => {
        if (res.payload.status === 200) {
          enqueueSnackbar(res?.payload?.message, { variant: "success" });
        } else {
          enqueueSnackbar(res?.payload?.message, { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
      });
  };

  /* Form submit */
  const handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData();
    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      setIsLoading(true);
      formData.append("first_name", profileData?.first_name);
      formData.append("last_name", profileData?.last_name);
      formData.append("email", profileData?.email);
      formData.append("phone", profileData?.phone);
      formData.append("street", addressSelect);
      formData.append("country", countryShort);
      formData.append("city", statecode);
      formData.append("zipcode", stateZip);
      formData.append("description", profileData?.description);
      formData.append("date_of_birth", DOB);
      formData.append("latitude", lat);
      formData.append("longitude", long);
      formData.append("gender", genderSelect);
      formData.append("country_code", country);
      


      if (profileImage !== null) {
        formData.append("profile_image", profileImage);
      }
      dispatch(updateProfileDetails(formData))
        .then((res) => {
          if (res.payload.status === 200) {
            enqueueSnackbar(res?.payload?.message, { variant: "success" });
            setIsLoading(false);
          } else {
            enqueueSnackbar(res?.payload?.message, { variant: "error" });
            setIsLoading(false);
          }
        })
        .catch(() => {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
          setIsLoading(false);
        });
    }
  };
  // default image show
  const onErrorImg = (ev) => {
    ev.target.src = assest.profile1;
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


  const handleSelectGender = (e) => {
    setGenderSelect(e.target.value);
  };


  

  /* insert Date of birth */

  const handleChange = (newValue) => {
    let date = new Date(newValue);
    /* Date format you have */
    let dateMDY = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()}`;
    setDOB(dateMDY);
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

  /* Using the useEffect hook to watch the country field and if it has a value, it will mutate the state
field. */
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

  // useEffect(() => {
  //   if (countrySelect !== "") {
  //     mutate({
  //       location_type: "state",
  //       country_code: countrySelect,
  //       state_code: "string",
  //     });
  //   }
  // }, [countrySelect]);

  const CountrySelect = ({ value, onChange, labels, ...rest }) => (
    <select
      {...rest}
      value={value}
      onChange={(event) => onChange(event.target.value || undefined)}
    >
      <option value="">{labels["ZZ"]}</option>
      {getCountries().map((country) => (
        <option key={country} value={getCountryCallingCode(country)}>
          {labels[country]} +{getCountryCallingCode(country)}
        </option>
      ))}
    </select>
  );

  return (
    <DashboardWrapper hasSidebar={true} headerType="search" page="user">
      <section className={styles.pageAccount}>
        <div className="dashboradHeadingCom">
          <h3 className="headingH3">Account</h3>
        </div>
        {isProfileLoading && getProfileData !== null ? (
          <>
            <div className={styles.userTopColumn}>
              <div className={styles.uploadUserImg}>
                <figure>
                  {profileImage !== null ? (
                    <Image
                      src={URL.createObjectURL(profileImage)}
                      width={105}
                      height={105}
                    />
                  ) : (
                    <img
                      src={
                        profileImageOriginal !== null
                          ? `${mediaPath}/uploads/user/profile_pic/${profileImageOriginal}`
                          : assest.noImage
                      }
                      width={105}
                      height={105}
                      onError={onErrorImg}
                    />
                  )}

                  {/* <Image src={assets.face01} alt="img" width={80} height={80} /> */}
                </figure>
                <div className={styles.customUploadWrap}>
                  {profileImage === null ? (
                    <>
                      <div className={styles.btnUpload}>
                        <input
                          onChange={handleProfileImage}
                          type="file"
                          accept="image/*"
                        />
                        <CameraAltIcon sx={{ cursor: "pointer" }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.btnUpload}>
                        <CameraAltIcon sx={{ cursor: "pointer" }} />
                        <input
                          onChange={handleProfileImage}
                          type="file"
                          accept="image/*"
                        />
                      </div>
                      {/* <div
                        className={styles.btnUpload}
                        onClick={handleEditPimage}
                      >
                        <CameraAltIcon sx={{ cursor: "pointer" }} />
                      </div> */}
                    </>
                  )}
                </div>
              </div>
              <div className={styles.usersInfo}>
                <h4>{getProfileData.full_name}</h4>
                <p>Manage your account name, email, and password.</p>
              </div>
            </div>
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
                        variant="filled"
                        value={profileData.first_name}
                        onChange={postUserData}
                        name="first_name"
                        placeholder=" Enter First Name"
                      />
                      {error.first_name && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.first_name}{" "}
                          </span>
                        </div>
                      )}
                    </div>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <div className={styles.formGroup}>
                      <label>Last name *</label>
                      <TextField
                        hiddenLabel
                        id="filled-hidden-label-normal"
                        // defaultValue="Doyle"
                        variant="filled"
                        value={profileData.last_name}
                        onChange={postUserData}
                        name="last_name"
                        placeholder=" Enter Last Name"
                      />
                      {error.last_name && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.last_name}{" "}
                          </span>
                        </div>
                      )}
                    </div>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <div className={styles.formGroup}>
                      <label>Email Address *</label>
                      <TextField
                        hiddenLabel
                        id="filled-hidden-label-normal"
                        // defaultValue="jasondoyle@gmail.com"
                        variant="filled"
                        type="email"
                        value={profileData.email}
                        //onChange={postUserData}
                        // onFocus={handleErrorRemove}
                        name="email"
                        disabled
                        placeholder=" Enter Email"
                      />
                    </div>
                  </Grid>
                  {/* <Grid item md={6} xs={12}>
                    <div className={styles.formGroup}>
                      <label>Password</label>
                      <TextField
                        hiddenLabel
                        id="filled-hidden-label-normal"
                        defaultValue="11111"
                        variant="filled"
                        type="password"
                      />
                    </div>
                  </Grid> */}
                <Grid item md={4} xs={12}>
                <div className={styles.formGroup}>
                <label>Country Code *</label>
                  <CountrySelect
                    labels={en}
                    defaultCountry="US"
                    value={country}
                    onChange={setCountry}
                  />
                   </div>
                   {error.country && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.country}{" "}
                          </span>
                        </div>
                      )}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <div className={styles.formGroup}>
                      <label>Phone number *</label>
                      <TextField
                        hiddenLabel
                        id="filled-hidden-label-normal"
                        defaultValue="Add phone number"
                        variant="filled"
                        value={profileData.phone}
                        onChange={postUserData}
                        name="phone"
                        type="number"
                        placeholder=" Enter Phone Number"
                      />
                    </div>
                    {error.phone && (
                      <div className="text-danger d-flex">
                        <span style={{ marginLeft: "5px", color: "red" }}>
                          {" "}
                          {error.phone}{" "}
                        </span>
                      </div>
                    )}
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <div className={styles.formGroup}>
                      <label>Street *</label>

                      <PlacesAutocomplete
                        name="street"
                        value={addressSelect}
                        onChange={(newValue) => setAddressSelect(newValue)}
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
                              name="street"
                              label="street"
                              {...getInputProps({
                                placeholder: "street",
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

                      {error.addressSelect && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.addressSelect}{" "}
                          </span>
                        </div>
                      )}
                    </div>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <div className={styles.formGroup}>
                      <label>Country *</label>
                      <select
                        value={countryShort}
                        onChange={handleSelectChange}
                        name="country"
                        disabled={!addressSelect}
                      >
                        <option value={""}>Select Country</option>
                        {countryList?.pages[0]?.data?.map((item, i) => (
                          <option
                            value={item?.isoCode}
                            key={i}
                            selected={item.isoCode === countryShort}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                      {error.countrySelect && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.countrySelect}{" "}
                          </span>
                        </div>
                      )}
                    </div>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <div className={styles.formGroup}>
                      <label>State *</label>
                      <select
                        value={statecode}
                        onChange={handleSelectChangeCity}
                        name="city"
                        disabled={!addressSelect}
                      >
                        <option value={""}>Select State</option>
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

                      {error.citySelect && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.citySelect}{" "}
                          </span>
                        </div>
                      )}
                    </div>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <div className={styles.formGroup}>
                      <label>ZipCode *</label>
                      <TextField
                        type="number"
                        name="zipcode"
                        onChange={handleSelectChangeZip}
                        value={stateZip}
                        placeholder="Enter ZipCode"
                        disabled={!addressSelect}
                      />
                      {error.stateZip && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.stateZip}{" "}
                          </span>
                        </div>
                      )}
                    </div>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <div className={styles.formGroup}>
                      <label>About Bio </label>
                      <textarea
                        id="filled-hidden-label-normal"
                        value={profileData.description}
                        onChange={postUserData}
                        name="description"
                        placeholder=" Enter About Bio"
                      />
                    </div>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <div className={styles.formGroup}>
                      <label>Gender</label>
                      <select onChange={handleSelectGender} name="gender">
                        {Gender.map((item, i) => (
                          <option
                            value={
                              item.value === genderSelect
                                ? genderSelect
                                : item.value
                            }
                            key={i}
                            selected={
                              item.value === genderSelect
                                ? genderSelect
                                : item.label
                            }
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <div className={styles.formGroup}>
                      <label>Date Of Birth</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                          label="Date of birth"
                          value={DOB}
                          onChange={handleChange}
                          inputFormat="DD/MM/YYYY"
                          disableFuture
                          renderInput={(params) => (
                            <TextField
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
                    </div>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <div className={styles.formGroup}>
                      <button className={styles.btnSave} onClick={handleSubmit}>
                        {isLoading ? "loading..." : "Save"}
                      </button>
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </div>
          </>
        ) : (
          <>
            <h4>Loading....</h4>
          </>
        )}
      </section>
    </DashboardWrapper>
  );
}

export default Index;
