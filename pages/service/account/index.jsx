import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useCallback, useEffect, useState } from "react";
import styles from "@/styles/service/editprofile.module.scss";

import { Container, IconButton, InputAdornment } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import { Cookies } from "react-cookie";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { regexFormat } from "@/json/regex/regexFormat";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  getProfileDetails,
  updateProfileDetails,
  getBadgeList,
} from "@/reduxtoolkit/profile.slice";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import assest from "@/json/assest";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useGetAllCountry, useGetAllStateMutation } from "@/hooks/useProfile";
import { error } from "@/json/customSms/cumtomSms";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { assert } from "@firebase/util";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  getAddresValue,
  getAddresValues,
} from "../../../Components/serviceForm/_helpers";

// import { error } from "@/json/customSms/cumtomSms";

const Gender = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
  {
    value: "others",
    label: "Others",
  },
];

const Week = [
  {
    value: "Monday",
    label: "Monday",
  },
  {
    value: "Tuesday",
    label: "Tuesday",
  },
  {
    value: "Wednesday",
    label: "Wednesday",
  },
  {
    value: "Thursday",
    label: "Thursday",
  },
  {
    value: "Friday",
    label: "Friday",
  },
  {
    value: "Saturday",
    label: "Saturday",
  },
  {
    value: "Sunday",
    label: "Sunday",
  },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 230,
      background: "#fff",
      color: "#000",
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function Index() {
  const cookie = new Cookies();
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { isProfileLoading, getProfileData, allBadgeList } = useSelector(
    (store) => store.profile
  );

  const [inputFields, setInputFields] = useState([
    {
      week_day: "",
      startTime: null,
      endTime: null,
    },
  ]);

  const [images, setImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [country, setCountry] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [uploadImage, setUploadImage] = useState([]);
  const [DOB, setDOB] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const { data: countryList } = useGetAllCountry();

  const { data: allStateList, mutate } = useGetAllStateMutation();

  const [countrySelect, setCountrySelect] = useState("");
  const [citySelect, setCitySelect] = useState("");
  const [weekSelect, setWeekSelect] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);

  const [profileImageOriginal, setProfileImageOriginal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [personName, setPersonName] = React.useState([]);
  // google place states
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const [addressSelect, setAddressSelect] = useState("");
  const [countryShort, setCountryShort] = useState("");
  const [statecode, setStatecode] = useState("");
  const [stateZip, setStateZip] = useState("");

  const [checkedState, setCheckedState] = useState([]);
  const [fileOriginal, setFileOriginal] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [globalsError, setGlobalsError] = useState([
    {
      week_day: false,
      startTime: false,
      endTime: false,
    },
  ]);

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    // street: "",
    // zipcode: "",
    business_name: "",
    business_info: "",
    instagram_id: "",
  });

  //inputfield onchange function
  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setProfileData({ ...profileData, [name]: value });
  };

  /**
   * It takes the event object from the input element, creates an empty array, then pushes the files
   * from the event object into the empty array
   */
  const handleMultipleImages = (event) => {
    const selectedFIles = [];
    const targetFiles = event.target.files;
    const targetFilesObject = [...targetFiles];
    targetFilesObject.map((file, i) => {
      return selectedFIles.push(file);
    });
    setUploadImage(selectedFIles);
  };

  function deleteFile(e) {
    const s = uploadImage.filter((item, index) => index !== e);
    setUploadImage(s);
  }
  // Delete Multiple images
  function deleteFiles(e) {
    let temp = deleteImages;
    const s = images.filter((item, index) => index !== e);
    const deleted = images.filter((item, index) => index === e);
    setImages(s);
    temp?.push(deleted[0]);
    setDeleteImages(temp);
  }

  /**
   * The function takes an event as an argument, and then sets the checked state to the value of the
   * event target, and then sets the person name to the value of the event target
   */
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setCheckedState(value);

    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  /* *|MARKER_CURSOR|* */

  useEffect(() => {
    dispatch(getProfileDetails());
    dispatch(getBadgeList());
  }, [isLoading]);

  /**
   * It sets the value of the badgeLists state to the value of the select element.
   */

  // Validation of form
  const validation = () => {
    let error = {};
    if (!documentFile) {
      error.documentFile = "Document file is required";
    }
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

    if (!country || country === undefined) {
      error.country = "Country Code is required";
    }

    if (!statecode) {
      error.statecode = "Street  Address can not be empty";
    }

    return error;
  };

  const validations = useCallback(() => {
    let global_error = [];
    let error = {};
    let count = 0;

    for (let i = 0; i < inputFields.length; i++) {
      let obj = {
        week_day: "",
        startTime: "",
        endTime: "",
      };

      const startNewsTime = dayjs(inputFields[i].startTime).format("HH:mm");
      const endNewsTime = dayjs(inputFields[i].endTime).format("HH:mm");

      const temp = startNewsTime.split(":");
      const addTime = `${temp[0]}${temp[1]}`;
      const newStartTimeFormate = Number(addTime);

      const tempSecond = endNewsTime.split(":");
      const addSecondTime = `${tempSecond[0]}${tempSecond[1]}`;
      const newEndTimeFormate = Number(addSecondTime);

      if (!inputFields[i].week_day) {
        count++;
        obj.week_day = "weekday is required";
      }

      if (!inputFields[i].startTime) {
        obj.startTime = "Start time is required";
        count++;
      } else if (newStartTimeFormate >= newEndTimeFormate) {
        obj.startTime = "Start time is less than End Time";
        count++;
      }

      if (!inputFields[i].endTime) {
        obj.endTime = "End Time is required";
        count++;
      }

      global_error.push(obj);
    }

    setGlobalsError(global_error);
    return count;
  }, [inputFields]);

  /* Setting the values of theform fields to the values of the data that is returned from the API. */
  useEffect(() => {
    if (getProfileData !== undefined) {
      let temp = { ...profileData };
      temp["first_name"] = getProfileData?.first_name;
      temp["last_name"] = getProfileData?.last_name;
      temp["email"] = getProfileData?.email;
      temp["phone"] = getProfileData?.phone;
      // temp["street"] = getProfileData?.street;
      // temp["zipcode"] = getProfileData?.zipcode;
      temp["business_name"] = getProfileData?.business_name;
      temp["business_info"] = getProfileData?.business_info;
      temp["instagram_id"] = getProfileData?.instagram_id;
      setCountry(getProfileData?.country_code);

      setCountryShort(getProfileData?.country);
      setStatecode(getProfileData?.city);
      setDOB(getProfileData?.date_of_birth);
      // setBadgeLists(getProfileData?.badge_id);
      setProfileImageOriginal(getProfileData?.business_image);
      setImages(getProfileData?.image_gallery);
      setDocumentFile(getProfileData?.technician_document);
      setAddressSelect(getProfileData?.street);
      setStateZip(getProfileData?.zipcode);

      let get_only = [];
      if (getProfileData) {
        getProfileData?.business_hours.map((item, index) => {
          // Time conversion
          var splitTiming = item?.timing?.split("-");
          const format24One = moment(splitTiming[0], "hh:mm a").format("HH:mm");
          const format24Two = moment(splitTiming[1], "hh:mm a").format("HH:mm");
          let timeFirst = format24One.split(":");
          let timeSecond = format24Two.split(":");
          let newDateTimeFirst = new Date().setHours(
            timeFirst[0],
            timeFirst[1],
            0,
            0
          );
          let newDateTimeSecond = new Date().setHours(
            timeSecond[0],
            timeSecond[1],
            0,
            0
          );
          let finalFirstDate = new Date(newDateTimeFirst);
          let finalSecondtDate = new Date(newDateTimeSecond);

          get_only.push({
            ...item,
            week_day: item?.week_day,
            startTime: finalFirstDate,
            endTime: finalSecondtDate,
          });

          setInputFields(get_only);
        });
      }

      let get_only_names = [];
      if (getProfileData) {
        getProfileData?.badge_id.map((item) => {
          let find_by_id = allBadgeList?.find((_item) => _item?._id === item);
          get_only_names.push(find_by_id?.title);
        });
      }
      setCheckedState(get_only_names);
      setPersonName(get_only_names);
      setProfileData(temp);
    }
  }, [isLoading, getProfileData]);

  /**
   * The above function is a function that is used to handle the change of the date of birth.
   */
  // const handleSelectChangeGender = (e) => {
  //   setGenderSelect(e.target.value);
  // };
  // const handleChangeDate = (newValue) => {
  //   setDOB(newValue);
  // };

  /**
   * A function that is called when an image fails to load.
   */
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

  /**
   * It checks if the file is an image and if it is, it checks if the size is less than 3MB. If both
   * conditions are true, it sets the profile image
   */
  const handleProfileImage = (e) => {
    if (
      e.target.files[0]?.type === "image/jpeg" ||
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpg"
    ) {
      if (e.target.files[0]?.size <= 3000000) {
        setProfileImage(e.target.files[0]);
      } else {
        enqueueSnackbar("Please upload image of proper size.", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please upload image of proper format.", {
        variant: "error",
      });
    }
  };

  // onchange function
  const fileUpload = (e) => {
    if (
      e.target.files[0]?.type === "image/jpeg" ||
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpg"
    ) {
      if (e.target.files[0]?.size <= 3000000) {
        setDocumentFile(e.target.files[0]);
      } else {
        enqueueSnackbar("Please upload image of proper size.", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please upload image of proper format.", {
        variant: "error",
      });
    }
  };

  const handleSelectChangeWeek = (e) => {
    setWeekSelect(e.target.value);
  };

  /**
   * It takes the image from the input field, creates a new FormData object, appends the image to the
   * formData object, and then dispatches the updateProfileDetails action with the formData object as
   * the payload
   */
  const handleEditPimage = (e) => {
    //let formData = new FormData();
    // console.log(profileImage,"profileImage");
    // formData.append("business_image", profileImage);
    // dispatch(updateProfileDetails(formData))
    //   .then((res) => {
    //     if (res.payload.status === 200) {
    //       enqueueSnackbar(res?.payload?.message, { variant: "success" });
    //       setUploadImage([]);
    //     } else {
    //       enqueueSnackbar(res?.payload?.message, { variant: "error" });
    //     }
    //   })
    //   .catch(() => {
    //     enqueueSnackbar("Something went wrong!", { variant: "error" });
    //   });
  };

  const handleAddFields = (e, i) => {
    e.preventDefault();
    setInputFields([
      ...inputFields,
      {
        week_day: "",
        startTime: null,
        endTime: null,
      },
    ]);
    // setGlobalsError([
    //   ...globalsError,
    //   {
    //     week_day: false,
    //     startTime: false,
    //     endTime: false,
    //   },
    // ]);
  };

  const handleChanges = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...inputFields];
    list[index][name] = value;
    setInputFields(list);
  };

  const handleChangesStartTime = (index, newValue) => {
    const list = [...inputFields];
    list[index].startTime = newValue;
    setInputFields(list);
  };

  const handleChangesEndTime = (index, newValue, evnt) => {
    const list = [...inputFields];
    list[index].endTime = newValue;
    setInputFields(list);
  };

  const removeInputFields = (index) => {
    const rows = [...inputFields];
    const deleteRows = [...globalsError];
    // rows.splice(index, 1);
    if (rows.length > 1) rows.pop();
    if (deleteRows.length > 1) deleteRows.pop();
    setInputFields(rows);
    setGlobalsError(deleteRows);
  };

  /**
   * It takes in the data from the form and sends it to the backend
   */
  const handleSubmitData = (e) => {
    e.preventDefault();
    var formData = new FormData();
    let ErrorListsCount = validations();

    var contain_error = false;

    let ErrorList = validation();
    setError(validation());
    // handleaddfield onsubmit validation
    if (ErrorListsCount) {
      return;
    }
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      setIsLoading(true);
      formData.append("first_name", profileData?.first_name);
      formData.append("last_name", profileData?.last_name);
      formData.append("email", profileData?.email);
      formData.append("phone", profileData?.phone);
      formData.append("business_name", profileData?.business_name);
      formData.append("business_info", profileData?.business_info);
      formData.append("instagram_id", profileData?.instagram_id);
      formData.append("street", addressSelect);
      formData.append("country", countryShort);
      formData.append("city", statecode);
      formData.append("zipcode", stateZip);
      formData.append("date_of_birth", DOB);
      formData.append("latitude", lat);
      formData.append("longitude", long);
      formData.append("country_code", country);

      {
        inputFields?.map((item, index) => {
          const startNewTime = dayjs(item?.startTime).format("hh:mm a");
          const endNewTime = dayjs(item?.endTime).format("hh:mm a");
          formData.append(`business_hours[${index}][week_day]`, item.week_day);
          formData.append(
            `business_hours[${index}][timing]`,
            `${startNewTime}-${endNewTime}`
          );
        });
      }

      let temp = [];
      checkedState?.map((item) => {
        return allBadgeList?.map((_Item) => {
          return _Item?.title === item && temp.push(_Item?._id);
        });
      });

      formData.append(`badge_id`, JSON.stringify(temp));

      if (profileImage !== null) {
        formData.append("business_image", profileImage);
      }

      if (documentFile !== null) {
        formData.append("technician_document", documentFile);
      }
      if (uploadImage !== null) {
        uploadImage?.map((file) => formData.append("image_gallery", file));
      }

      if (deleteImages !== null) {
        deleteImages?.map((item) => formData.append("del_gallery_img[]", item));
      }

      dispatch(updateProfileDetails(formData))
        .then((res) => {
          if (res.payload.status === 200) {
            cookie.set("userDetails", JSON.stringify(getProfileData));
            enqueueSnackbar(res?.payload?.message, { variant: "success" });
            setUploadImage([]);
            setIsLoading(false);
          } else {
            enqueueSnackbar(res?.payload?.message, { variant: "error" });
            setIsLoading(false);
          }
        })
        .catch(() => {
          enqueueSnackbar("Phone number already exists", {
            variant: "error",
          });
          setIsLoading(false);
        });
    }
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

  /* insert date of birth */

  const handleChangeDates = (newValue) => {
    let date = new Date(newValue);
    /* Date format you have */
    let dateMDY = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()}`;
    setDOB(dateMDY);
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

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
    <DashboardWrapper headerType="search" page="service">
      <Container>
        <div className={styles.jobs_wrapper}>
          <div className={styles.heading_top}>
            <h3
              className="headingH3 pointerBtn"
              onClick={() => router.push("/service/dashboard")}
            >
              <KeyboardBackspaceIcon /> Dashboard
            </h3>
          </div>
          <div className={styles.messages}>
            {getProfileData?.account_verified === true &&
            getProfileData?.isSignupCompleted === true ? null : (
              <Alert variant="outlined" severity="error">
                You Are Not Verified. Please complete Profile First!
              </Alert>
            )}
          </div>
          {isProfileLoading && getProfileData !== null ? (
            <>
              <div className={styles.edit_profile_sec}>
                <div className={styles.edit_profile_sec_left}>
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
                              ? `${mediaPath}/uploads/user/business_image/${profileImageOriginal}`
                              : assest.noImage
                          }
                          width={105}
                          height={105}
                          onError={onErrorImg}
                        />
                      )}
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
                </div>
                <div className={styles.edit_profile_sec_right}>
                  <h2>{getProfileData?.full_name}</h2>
                  <p>Manage your account name, email, and password.</p>
                </div>
              </div>
              <div className={styles.jobs_wrapper}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item md={6} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <label>First Name *</label>
                        <input
                          type="text"
                          placeholder="Enter First Name"
                          value={profileData.first_name}
                          onChange={postUserData}
                          name="first_name"
                        />
                      </div>

                      {error.first_name && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.first_name}{" "}
                          </span>
                        </div>
                      )}
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <label>Last Name *</label>
                        <input
                          type="text"
                          placeholder="Enter Last Name"
                          value={profileData.last_name}
                          onChange={postUserData}
                          name="last_name"
                        />
                      </div>
                      {error.last_name && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.last_name}{" "}
                          </span>
                        </div>
                      )}
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <label>Email Address * </label>
                        <input
                          placeholder="Enter Email"
                          variant="filled"
                          type="email"
                          value={profileData.email}
                          name="email"
                          disabled
                        />
                      </div>
                    </Grid>

                    <Grid item md={4} xs={12}>
                      <div className={styles.form_sec}>
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
                    <Grid item md={4} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <label>Phone Number * </label>
                        <input
                          type="number"
                          placeholder="Enter Phone Number"
                          value={profileData.phone}
                          onChange={postUserData}
                          variant="filled"
                          name="phone"
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

                    <Grid item md={6} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <label>Business Name</label>
                        <input
                          type="text"
                          placeholder="Enter Business name"
                          value={profileData.business_name}
                          onChange={postUserData}
                          name="business_name"
                        />
                      </div>
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <label>Instagram id</label>
                        <input
                          type="text"
                          placeholder="Enter  instagram id"
                          value={profileData.instagram_id}
                          onChange={postUserData}
                          name="instagram_id"
                        />
                      </div>
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <label>Badge List</label>

                        <FormControl sx={{ m: 1, width: 300 }}>
                          <InputLabel id="demo-multiple-checkbox-label">
                            Select Badge
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return <em>Placeholder</em>;
                              }
                              return selected.join(", ");
                            }}
                            MenuProps={MenuProps}
                          >
                            {allBadgeList?.map((name) => (
                              <MenuItem
                                key={name?.title}
                                value={name?.title}
                                style={getStyles(
                                  name?.title,
                                  personName,
                                  theme
                                )}
                              >
                                {name?.title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {/* <select
                          value={badgeLists}
                          onChange={handleSelectChangeBadgeList}
                          name="badge"
                        >
                          <option value={""}>Select Badge Lists</option>
                          {allBadgeList?.map((item, i) => (
                            <option
                              value={
                                item?._id === badgeLists
                                  ? badgeLists
                                  : item?._id
                              }
                              key={i}
                              selected={
                                item.title === badgeLists
                                  ? badgeLists
                                  : item.title
                              }
                            >
                              {item.title}
                            </option>
                          ))}
                        </select> */}
                      </div>
                    </Grid>

                    {/* <Grid item md={6} sm={12} xs={12}>
                  <div className={styles.form_sec}>
                    <label>Change Payment Method</label>
                    <select>
                      <option>Card</option>
                      <option>Card</option>
                    </select>
                    <Image
                      src={assets.downArrow}
                      width={10}
                      height={10}
                      className={styles.downarrow}
                    />
                    <input type="text" placeholder="Card"/>
                  </div>
                </Grid> */}

                    <Grid item md={6} sm={12} xs={12}>
                      <div className={styles.form_sec}>
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
                      </div>
                      {error.addressSelect && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.addressSelect}{" "}
                          </span>
                        </div>
                      )}
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <label>ZipCode *</label>

                        <input
                          type="number"
                          name="zipcode"
                          onChange={handleSelectChangeZip}
                          value={stateZip}
                          placeholder="Enter ZipCode"
                          disabled={!addressSelect}
                        />
                      </div>
                      {error.stateZip && (
                        <div className="text-danger d-flex">
                          <span style={{ marginLeft: "5px", color: "red" }}>
                            {" "}
                            {error.stateZip}{" "}
                          </span>
                        </div>
                      )}
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <div className={styles.form_sec}>
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
                    {allStateList?.data !== undefined && (
                      <Grid item md={3} sm={12} xs={12}>
                        <div className={styles.form_sec}>
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

                          {error.statecode && (
                            <div className="text-danger d-flex">
                              <span style={{ marginLeft: "5px", color: "red" }}>
                                {" "}
                                {error.statecode}{" "}
                              </span>
                            </div>
                          )}
                        </div>
                      </Grid>
                    )}

                    <Grid item md={3} xs={12}>
                      <div className={styles.formGroups}>
                        <label>Date Of Birth</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileDatePicker
                            name="DateOfBirth"
                            value={DOB}
                            onChange={handleChangeDates}
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

                    <Grid item md={12} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <label>Business Info</label>
                        <textarea
                          placeholder="Write your Business Info"
                          value={profileData.business_info}
                          onChange={postUserData}
                          name="business_info"
                        ></textarea>
                      </div>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        {getProfileData?.technician_document !== "" ? (
                          <>
                            <img
                              src={`${mediaPath}/uploads/user/technician_document/${getProfileData?.technician_document}`}
                              width={105}
                              height={105}
                              onError={onErrorImg}
                            />
                          </>
                        ) : (
                          <>
                            <label>Document Upload *</label>
                            <div className={styles.fileUpload}>
                              {/* <Document
                          options={{ workerSrc: "/pdf.worker.js" }}
                          file={
                            documentFile !== undefined
                              ? `${mediaPath}/uploads/user/technician_document/${documentFile}`
                              : null
                          }
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page pageNumber={pageNumber} />
                        </Document> */}
                              <input
                                onChange={fileUpload}
                                type="file"
                                accept="image/*"
                              />
                              <div className="error">{error.documentFile}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <div
                        className={`${styles.form_sec} ${styles.form_sec_form}`}
                      >
                        <label>Multiple Image Upload</label>
                        <Image
                          src={assest.imageuploadicon}
                          width={40}
                          height={40}
                        />
                        <input
                          type="file"
                          onChange={handleMultipleImages}
                          multiple
                        />
                      </div>
                      <div className={styles.form_image_sec}>
                        {images?.length
                          ? images?.map((url, index) => {
                              return (
                                <div className={styles.img_space}>
                                  {(url !== null || url !== "") && (
                                    <div className={styles.card_service}>
                                      <div className={styles.file_delete}>
                                        <button
                                          onClick={() => deleteFiles(index)}
                                        >
                                          <Image
                                            src={assest?.closeBtn}
                                            width={7}
                                            height={7}
                                          />
                                        </button>
                                      </div>
                                      <img
                                        src={`${mediaPath}/uploads/user/image_gallery/${url}`}
                                        width={20}
                                        height={20}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          : null}

                        {uploadImage?.length
                          ? uploadImage?.map((url, index) => {
                              return (
                                <div className={styles.img_space}>
                                  {(url !== null || url !== "") && (
                                    <div className={styles.card_service}>
                                      <div className={styles.file_delete}>
                                        <button
                                          onClick={() => deleteFile(index)}
                                        >
                                          <Image
                                            src={assest?.closeBtn}
                                            width={7}
                                            height={7}
                                          />
                                        </button>
                                      </div>
                                      <img
                                        src={URL.createObjectURL(url)}
                                        width={20}
                                        height={20}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          : null}
                      </div>
                    </Grid>

                    <div className={styles.weekandtime}>
                      <label>Business Hours</label>

                      {inputFields?.map((data, index) => {
                        return (
                          <div className={styles.total_flex}>
                            <div className={styles.week_update}>
                              <Grid container spacing={2}>
                                <Grid item md={4} sm={12} xs={12}>
                                  <FormControl sx={{ width: 150 }}>
                                    <InputLabel id="demo-simple-select-label">
                                      Change Day
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      value={data.week_day}
                                      label="select Week days"
                                      name="week_day"
                                      // onChange={handleSelectChangeWeek}
                                      onChange={(evnt) =>
                                        handleChanges(index, evnt)
                                      }
                                    >
                                      {Week.map((item, i) => (
                                        <MenuItem key={i} value={item.value}>
                                          {item.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  {globalsError &&
                                  globalsError[index] &&
                                  globalsError[index].week_day ? (
                                    <div className="text-danger d-flex">
                                      <span
                                        style={{
                                          marginLeft: "5px",
                                          color: "red",
                                        }}
                                      >
                                        {" "}
                                        {globalsError[index].week_day}{" "}
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <TimePicker
                                      label="Select Start time"
                                      value={data.startTime}
                                      name="timing"
                                      className={styles.time_picker}
                                      onChange={(newValue, evnt) =>
                                        handleChangesStartTime(
                                          index,
                                          newValue,
                                          evnt
                                        )
                                      }
                                      renderInput={(props) => (
                                        <TextField
                                          {...props}
                                          size="small"
                                          helperText={null}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>

                                  {globalsError &&
                                  globalsError[index] &&
                                  globalsError[index].startTime ? (
                                    <div className="text-danger d-flex">
                                      <span
                                        style={{
                                          marginLeft: "5px",
                                          color: "red",
                                        }}
                                      >
                                        {" "}
                                        {globalsError[index].startTime}{" "}
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <TimePicker
                                      label="Select End time"
                                      value={data.endTime}
                                      name="timing"
                                      className={styles.time_picker}
                                      onChange={(newValue) =>
                                        handleChangesEndTime(index, newValue)
                                      }
                                      renderInput={(props) => (
                                        <TextField
                                          {...props}
                                          size="small"
                                          helperText={null}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>

                                  {globalsError &&
                                  globalsError[index] &&
                                  globalsError[index].endTime ? (
                                    <div className="text-danger d-flex">
                                      <span
                                        style={{
                                          marginLeft: "5px",
                                          color: "red",
                                        }}
                                      >
                                        {" "}
                                        {globalsError[index].endTime}{" "}
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </Grid>
                              </Grid>
                            </div>
                            <div className={styles.remove_btn}>
                              {inputFields.length !== 1 ? (
                                <Stack direction="row" spacing={1}>
                                  <IconButton aria-label="delete" size="large">
                                    <DeleteIcon
                                      fontSize="inherit"
                                      onClick={removeInputFields}
                                    />
                                  </IconButton>
                                </Stack>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div className={styles.add_btn}>
                        <Box sx={{ "& > :not(style)": { m: 1 } }}>
                          <Fab color="primary" aria-label="add">
                            <AddIcon
                              onClick={(e, i) => handleAddFields(e, i)}
                            />
                          </Fab>
                        </Box>
                      </div>
                    </div>

                    <Grid item md={12} sm={12} xs={12}>
                      <div className={styles.form_sec}>
                        <button
                          className={styles.submit_btn}
                          onClick={handleSubmitData}
                        >
                          {isLoading ? "Loading..." : "Save"}
                        </button>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </>
          ) : (
            <>loading...</>
          )}
        </div>
      </Container>
    </DashboardWrapper>
  );
}

export default Index;
