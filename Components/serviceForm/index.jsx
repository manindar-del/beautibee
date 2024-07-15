import React, { useState, useEffect } from "react";
import { Box, Grid, IconButton, InputAdornment } from "@mui/material";
import Image from "next/image";
import assets from "@/json/assest";
import { MobileDatePicker } from "@mui/x-date-pickers";
import styles from "@/styles/service/addservice.module.scss";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import assest from "@/json/assest";
import { useMutation } from "react-query";
import {
  useCreateService,
  useUpdateService,
  GetServiceDetails,
  useGetAllStateMutation,
} from "@/hooks/useService";
import { getAddresValue, getAddresValues } from "../serviceForm/_helpers";

import { useRouter } from "next/router";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";


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

const durations = [
  {
    value: "30",
    label: "30 min",
  },
  {
    value: "60",
    label: "1 hr",
  },

  {
    value: "90",
    label: "1 hr 30 min",
  },

  {
    value: "120",
    label: "2 hr ",
  },

  {
    value: "150",
    label: "2 hr 30 min",
  },

  {
    value: "180",
    label: "3 hr",
  },
];

function ServiceForm({
  allExperienceList,
  allServiceCategories,
  allBadgeList,
  allCountryList,
}) {
  const router = useRouter();
  const theme = useTheme();
  const { data: allStateList, mutate } = useGetAllStateMutation();
  const [error, setError] = useState({});

  const [countrySelect, setCountrySelect] = useState("");
  const [citySelect, setCitySelect] = useState("");
  const [experienceLists, setExperienceLists] = useState("");
  const [categoryList, setCategoryList] = useState("");
  //const [badgeLists, setBadgeLists] = useState("");
  //const [duration, setDuration] = useState("");
  const [startValues, setStartValues] = useState("");
  const [endValues, setEndValues] = useState("");
  const [personName, setPersonName] = useState([]);
  const [checkedState, setCheckedState] = useState([] && "");

  const [city, setCity] = useState("");
  const [countery, setCountry] = useState("");

  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const [addressSelect, setAddressSelect] = useState("");
  const [countryShort, setCountryShort] = useState("");
  const [statecode, setStatecode] = useState("");
  const [stateZip, setStateZip] = useState("");

  const [inputData, setInputData] = useState({
    title: "",
    description: "",
    price: "",
    // address: "",
    duration: "",
  });

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

  const { mutate: createService } = useCreateService();
  const { mutate: updateService } = useUpdateService();

  //inputfield onchange function
  let name, value;
  /**
   * The function takes an event as an argument, and then sets the name and value of the event target to
   * the name and value variables. Then, it sets the inputData state to the inputData object with the
   * name and value variables
   */
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  /**
   * It checks if the input fields are empty and if they are, it returns an error object with the name
   * of the field that is empty
   * @returns an object.
   */
  const validation = () => {
    let error = {};
    if (!inputData.title) {
      error.title = "Service Name is required";
    }

    if (!inputData.description) {
      error.description = "Service Details is required";
    }

    if (!inputData.price) {
      error.price = "Price Details is required";
    }

    if (!addressSelect) {
      error.addressSelect = "Location Details is required";
    }

    if (!countryShort) {
      error.countryShort = "Country is required";
    }

    if (!statecode) {
      error.statecode = "State is required";
    }

    if (!experienceLists) {
      error.experienceLists = "Experience is required";
    }

    if (!categoryList) {
      error.categoryList = "Service Category is required";
    }
    if (!checkedState) {
      error.checkedState = "Badge is required";
    }
    if (!router.query.id) {
      if (!checkedState) {
        error.checkedState = "Badge is required";
      }
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

    if (!inputData.duration) {
      error.duration = "Time Duration is required";
    } else if (/^[-+]?[0-9]+\.[0-9]+$/.test(inputData.duration)) {
      error.duration = "Time Duration is not in point";
    }

    // if (!startValues) {
    //   error.startValues = "StartDate is required";
    // }

    // if (!endValues) {
    //   error.endValues = "EndDate is required";
    // }

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

  const handleSelectChangeExperience = (e) => {
    setExperienceLists(e.target.value);
  };

  const handleSelectChangeServiceCategory = (e) => {
    setCategoryList(e.target.value);
  };

  // const handleSelectChangeBadgeList = (e) => {
  //   setBadgeLists(e.target.value);
  // };

  // const handleSelectChangeDuration = (e) => {
  //   setDuration(e.target.value);
  // };

  /**
   * It's a function that takes an event as an argument and prevents the default action of the event,
   * creates a new FormData object, creates an ErrorList object, sets the error state, checks if the
   * ErrorList object has any keys, if it does, it does nothing, if it doesn't, it appends the formData
   * object with the inputData object, the experienceLists, categoryList, countrySelect, citySelect,
   * duration, and checkedState objects, and then checks if the router.query.id exists, if it does, it
   * appends the formData object with the router.query.id and calls the updateService function, if it
   * doesn't, it calls the createService function
   */
  const add = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      formData.append("title", inputData.title);
      formData.append("description", inputData.description);
      formData.append("price", inputData.price);
      formData.append("experience_id", experienceLists);
      formData.append("category_id", categoryList);
      //formData.append("badge_id", JSON.stringify(badgeLists));
      formData.append("address", addressSelect);
      formData.append("country", countryShort);
      formData.append("city", statecode);
      formData.append("zip", stateZip);
      formData.append("duration", inputData.duration);
      formData.append("latitude", lat);
      formData.append("longitude", long);

      // formData.append("availability_start_date", startValues);
      // formData.append("availability_end_date", endValues);

      // submit multiple select item
      let temp = [];
      checkedState?.map((item) => {
        return allBadgeList?.map((_Item) => {
          return _Item?.title === item && temp.push(_Item?._id);
        });
      });

      formData.append(`badge_id`, JSON.stringify(temp));

      if (router.query.id) {
        formData.append("service_id", router.query.id);
        updateService(formData);
      } else {
        createService(formData);
      }
    }
  };

  /* *|CURSOR_MARCADOR|* */
  useEffect(() => {
    if (router.query.id) {
      GetServiceDetails(router.query.id).then((data) => {
        //console.log(data);
        setInputData({
          title: data?.data[0]?.title,
          description: data?.data[0]?.description,
          price: data?.data[0]?.price,
          // address: data?.data[0]?.address,
          // zip: data?.data[0]?.zip,
          duration: data?.data[0]?.duration,
        });

        setExperienceLists(data?.data[0]?.experience_id);
        setCategoryList(data?.data[0]?.category_id);
        //setBadgeLists(data?.data[0]?.badge_id);
        setCountryShort(data?.data[0]?.country);
        setStatecode(data?.data[0]?.city);
        setAddressSelect(data?.data[0]?.address);
        setStateZip(data?.data[0]?.zip);
        //setDuration(data?.data[0]?.duration);
        // setStartValues(data?.data[0]?.availability_start_date);
        // setEndValues(data?.data[0]?.availability_end_date);

        // multiple select item show in edit
        let get_only_names = [];
        if (data) {
          data?.data[0]?.badge_id.map((item) => {
            let find_by_id = allBadgeList?.find((_item) => _item?._id === item);
            get_only_names.push(find_by_id?.title);
          });
        }
        setCheckedState(get_only_names);
        setPersonName(get_only_names);
      });
    }
  }, [router.query.id]);

  // useEffect(() => {
  //   if (countrySelect !== "") {
  //     mutate({
  //       location_type: "state",
  //       country_code: countrySelect,
  //       state_code: "string",
  //     });
  //   }
  // }, [countrySelect]);

  // location

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
        setCountry(county);
        setStateZip(zipcode);
        setLat(latLng?.lat);
        setLong(latLng?.lng);
        setCountryShort(countyShort);
      })
      .catch((error) => {
        console.log(error, "ERROR");
      });
  };

  /* Using the useEffect hook to mutate the data in the state. */
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

  return (
    <div className={styles.add_jobs}>
      <div className={styles.jobs_input}>
        <label>Service name *</label>
        <input
          type="text"
          name="title"
          onChange={postUserData}
          value={inputData.title}
          placeholder=" Enter Service name"
        />
      </div>
      <div className="error">{error.title}</div>
      <div className={styles.jobs_input}>
        <label>Service details *</label>
        <textarea
          name="description"
          onChange={postUserData}
          value={inputData.description}
          placeholder="Enter Service details"
        />
      </div>
      <div className="error">{error.description}</div>
      <div className={styles.jobs_input}>
        <label>Experience *</label>
        <div className={styles.select_box}>
          <Image src={assets.downarrow} width={10} height={10} />
          <select
            value={experienceLists}
            onChange={handleSelectChangeExperience}
            name="experince"
          >
            <option value={""}>Select Experience</option>
            {allExperienceList?.map((item, i) => (
              <option
                value={
                  item?._id === experienceLists ? experienceLists : item?._id
                }
                key={i}
                selected={
                  item.title === experienceLists ? experienceLists : item.title
                }
              >
                {item.title}
              </option>
            ))}
          </select>
          <div className="error">{error.experienceLists}</div>
        </div>
      </div>
      <div className={styles.jobs_input}>
        <label>Category *</label>
        <div className={styles.select_box}>
          <Image src={assets.downarrow} width={10} height={10} />
          <select
            value={categoryList}
            onChange={handleSelectChangeServiceCategory}
            name="category"
          >
            <option value={""}>Select Category</option>
            {allServiceCategories?.map((item, i) => (
              <option
                value={item?._id === categoryList ? categoryList : item?._id}
                key={i}
                selected={
                  item.title === categoryList ? categoryList : item.title
                }
              >
                {item.title}
              </option>
            ))}
          </select>
          <div className="error">{error.categoryList}</div>
        </div>
      </div>
      <label>Badge Lists *</label>
      <div className={styles.jobs_input}>
        <div className={styles.select_box}>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">
              Select Badge *
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
                  style={getStyles(name?.title, personName, theme)}
                >
                  {name?.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error.checkedState && (
            <div className="text-danger d-flex">
              <span style={{ marginLeft: "5px", color: "red" }}>
                {" "}
                {error.checkedState}{" "}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.jobs_input}>
        <label>Service Price *</label>
        <input
          type="number"
          name="price"
          onChange={postUserData}
          value={inputData.price}
          placeholder="Enter Service Price"
        />
      </div>
      <div className="error">{error.price}</div>
      <div className={styles.job_location}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item md={3} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>Service Location *</label>
                <div className={styles.select_box}>
                  <Image src={assets.address} width={15} height={15} />
                  {/* <input
                    type="text"
                    name="address"
                    onChange={postUserData}
                    value={inputData.address}
                    placeholder=" Enter street address"
                  /> */}

                  <PlacesAutocomplete
                    name="address"
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
              </div>
              <div className="error">{error.addressSelect}</div>
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>Country *</label>
                <div className={styles.select_box}>
                  <Image src={assets.downarrow} width={10} height={10} />

                  <select
                    value={countryShort}
                    onChange={handleSelectChange}
                    name="country"
                    disabled={!addressSelect}
                  >
                    <option value={""}>Select Country</option>
                    {allCountryList?.map((item, i) => (
                      <option
                        value={item?.isoCode}
                        key={i}
                        selected={item.isoCode === countryShort}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="error">{error.countryShort}</div>
              </div>
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>State *</label>
                <div className={styles.select_box}>
                  <Image src={assets.downarrow} width={10} height={10} />

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
                </div>
              </div>
              <div className="error">{error.statecode}</div>
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <label>Zip *</label>
              <div className={styles.jobs_input}>
                <input
                  type="text"
                  name="zip"
                  onChange={handleSelectChangeZip}
                  value={stateZip}
                  placeholder="Enter ZipCode"
                  disabled={!addressSelect}
                />
              </div>
              <div className="error">{error.stateZip}</div>
            </Grid>
          </Grid>
        </Box>
      </div>

      <div className={`${styles.jobs_input} ${styles.jobs_input_text}`}>
        <label>Time Duration * </label>
        <div className={styles.select_box}>
          <input
            type="number"
            name="duration"
            onChange={postUserData}
            value={inputData.duration}
            placeholder="Enter Time Duration in min"
            
            onKeyDown={(e) =>
              (e.keyCode === 69 ||
                e.keyCode === 190 ||
                e.keyCode === 107 ||
                e.keyCode === 109 ||
                e.keyCode === 189 ||
                e.keyCode === 86 ||
                e.keyCode === 16) &&
              e.preventDefault()
            }


          />

          <div className="error">{error.duration}</div>

          {/* <Image src={assets.downarrow} width={10} height={10} /> */}
          {/* <select
            value={duration}
            onChange={handleSelectChangeDuration}
            name="duration"
          >
            <option value={""}>Select Duration</option>
            {durations?.map((item, i) => (
              <option
                value={item?.value === duration ? duration : item?.value}
                key={i}
                selected={item?.label === duration ? duration : item?.label}
              >
                {item?.label}
              </option>
            ))}
          </select> */}
        </div>
      </div>

      <div className={styles.job_location}>
        {/* <h2>Set Service Availability</h2>
        <br />
        <h2>Available Date & time</h2>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item md={4} sm={12} xs={12}>
              <div className={styles.time_box}>
                <h2>From *</h2>
                <h3>
                  <Image src={assets.date} width={18} height={18} /> Date
                </h3>
                <ul> */}
        {/* <li>Today</li>
                  <li>Soon</li> */}
        {/* <li>
                    <select>
                      <option>Select Date</option>
                      <option>Select Date</option>
                      <option>Select Date</option>
                    </select>
                    <Image
                      src={assets.downArrow}
                      width={18}
                      height={18}
                      className={styles.downarrow}
                    />
                  </li> */}

        {/* <li>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDatePicker
                        name="availability_start_date"
                        value={startValues}
                        onChange={(newValues) =>
                          setStartValues(new Date(newValues).toISOString())
                        }
                        inputFormat="YYYY-MM-DD"
                        enableFuture
                        renderInput={(params) => (
                          <TextField
                            // helperText={invalid ? error.message : null}
                            placeholder=" Select starting date"
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
                    {error.startValues ? (
                      <div className="error">{error.startValues}</div>
                    ) : null}
                  </li> */}
        {/* </ul> */}
        {/* <h3>
                  <Image src={assets.time} width={18} height={18} /> Time
                </h3>
                <Image src={assets.timesheet} width={317} height={95} /> */}
        {/* </div>
            </Grid> */}
        {/* <Grid item md={4} sm={12} xs={12}>
              <div className={styles.time_box}>
                <h2>To *</h2>
                <h3>
                  <Image src={assets.date} width={18} height={18} /> Date
                </h3>
                <ul> */}
        {/* <li>Today</li>
                  <li>Soon</li> */}
        {/* <li>
                    <select>
                      <option>Select Date</option>
                      <option>Select Date</option>
                      <option>Select Date</option>
                    </select>
                    <Image
                      src={assets.downArrow}
                      width={18}
                      height={18}
                      className={styles.downarrow}
                    />
                  </li> */}

        {/* <li>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDatePicker
                        name="availability_end_date"
                        value={endValues}
                        onChange={(newValues) =>
                          setEndValues(new Date(newValues).toISOString())
                        }
                        inputFormat="YYYY-MM-DD"
                        disablePast
                        renderInput={(params) => (
                          <TextField
                            // helperText={invalid ? error.message : null}
                            placeholder=" Select End date"
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
                    {error.endValues ? (
                      <div className="error">{error.endValues}</div>
                    ) : null}
                  </li>
                </ul> */}
        {/* <h3>
                  <Image src={assets.time} width={18} height={18} /> Time
                </h3>
                <Image src={assets.timesheet} width={317} height={95} /> */}
        {/* </div>
            </Grid>
          </Grid>
        </Box> */}
        <div className={styles.upload_image}>
          <button type="button" onClick={add}>
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceForm;
