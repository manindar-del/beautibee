import React, { useState, useEffect } from "react";
import { Box, Grid, IconButton, InputAdornment } from "@mui/material";
import Image from "next/image";
import assets from "@/json/assest";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";

import { MobileDatePicker } from "@mui/x-date-pickers";
import assest from "@/json/assest";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useGetAllStateMutation } from "@/hooks/useJobs";
import moment from "moment";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import { getAddresValue, getAddresValues } from "../serviceForm/_helpers";

const urgentList = [
  {
    value: true,
    label: "True",
  },
  {
    value: false,
    label: "False",
  },
];

const jobTypeList = [
  {
    value: "Full time",
    label: "Full time",
  },
  {
    value: "Part time",
    label: "part time",
  },
];

const positionList = [
  {
    value: "Trainee",
    label: "Trainee",
  },
  {
    value: "Junior",
    label: "Junior",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
  },
  {
    value: "Experience",
    label: "Experience",
  },
];

const experienceList = [
  {
    value: "0-1 Years",
    label: "0-1 Years",
  },
  {
    value: "2-4 Years",
    label: "2-4 Years",
  },
  {
    value: "5-7 Years",
    label: "5-7 Years",
  },
  {
    value: "8-10 Years",
    label: "8-10 Years",
  },
];
const memberList = [
  {
    value: "1-5",
    label: "1-5",
  },
  {
    value: "1-8",
    label: "1-8",
  },
  {
    value: "1-15",
    label: "1-15",
  },
  {
    value: "1-20",
    label: "1-20",
  },
];

const JobForm = ({
  styles,
  register,
  errors,
  handleSubmit,
  handleSubmitFormData,
  setValue,
  Controller,
  control,
  allCategoryList,
  allCountryList,
  formType,
  watch,
  reset,
}) => {
  const submitData = (data) => {
    handleSubmitFormData({
      ...data,
      end_date: moment(data?.end_date).format("YYYY-MM-DD HH:mm"),
    });
  };

  const { data: allStateList, mutate } = useGetAllStateMutation();

  
  // country wise state select

  // useEffect(() => {
  //   if (watch("country")?.length) {
  //     mutate({
  //       location_type: "state",
  //       country_code: watch("country"),
  //       state_code: "string",
  //     });
  //   }
  // }, [watch("country")]);

  const handleSelect_current_location = async (value) => {
    let city = "";
    let countyShort = "";
    let county = "";
    let zipcode = "";
    //get state
    let state = "";
    setValue("location", value);
    geocodeByAddress(value)
      .then((results) => {
        // get city
        //console.log(results, "results");
        //city =  getAddresValue(results[0]?.address_components, "locality");

        // get County
        county = getAddresValue(results[0]?.address_components, "country");

        // short name
        countyShort = getAddresValues(
          results[0]?.address_components,
          "country"
        );

        //get state
        state = getAddresValue(
          results[0]?.address_components,
          "administrative_area_level_1"
        );

        zipcode = getAddresValue(results[0]?.address_components, "postal_code");

        return getLatLng(results[0]);
      })
      .then((latLng) => {
        setValue("country", countyShort);
        setValue("city", state);
        setValue("zipcode", zipcode);
        // setValue("lat", latLng?.lat);
        // setValue("long", latLng?.lng);
      })
      .catch((error) => {
        console.log(error, "ERROR");
      });
  };

  useEffect(() => {
    if (watch("country")?.length) {   
    mutate({
      location_type: "state",
      country_code: watch("country"),
      state_code: "string",
    });
  }
  
  }, [watch("country")]);

  return (
    <>
      <div className={styles.add_jobs}>
        <h3>{formType} Job</h3>
        <div className={styles.jobs_input}>
          <label>Job title *</label>
          <input
            type="text"
            placeholder=" Enter Job Title"
            {...register("title")}
          />
          {errors.title && (
            <div className="text-danger d-flex">
              <span style={{ marginLeft: "5px", color: "red" }}>
                {" "}
                {errors.title?.message}{" "}
              </span>
            </div>
          )}
        </div>
        <div className={styles.jobs_input}>
          <label>Job details *</label>

          <textarea placeholder=" Enter Job details" {...register("content")} />
          {errors.content && (
            <div className="text-danger d-flex">
              <span style={{ marginLeft: "5px", color: "red" }}>
                {" "}
                {errors.content?.message}{" "}
              </span>
            </div>
          )}
        </div>
        <div className={styles.jobs_input}>
          <label>Job category *</label>
          <div className={styles.select_box}>
            <Image src={assets.downarrow} width={10} height={10} />

            <select {...register("job_category")}>
              <option value="">Please choose an Job Category</option>
              {allCategoryList?.map((item) => {
                return (
                  <option
                    key={item?._id}
                    style={{ color: "#000" }}
                    value={item?._id}
                  >
                    {item?.title}
                  </option>
                );
              })}
            </select>

            {errors.job_category && (
              <div className="text-danger d-flex">
                <span style={{ marginLeft: "5px", color: "red" }}>
                  {" "}
                  {errors.job_category?.message}{" "}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.jobs_input}>
          <label>Job price *</label>

          <input
            type="number"
            placeholder=" Enter Job price"
            {...register("pay_upto")}
          />
          {errors.pay_upto && (
            <div className="text-danger d-flex">
              <span style={{ marginLeft: "5px", color: "red" }}>
                {" "}
                {errors.pay_upto?.message}{" "}
              </span>
            </div>
          )}
        </div>
        <div className={styles.jobs_input}>
          <label>Phone number *</label>

          <input
            type="text"
            placeholder="Enter Phone number"
            {...register("phone")}
          />
          {errors.phone && (
            <div className="text-danger d-flex">
              <span style={{ marginLeft: "5px", color: "red" }}>
                {" "}
                {errors.phone?.message}{" "}
              </span>
            </div>
          )}
        </div>
        <div className={styles.jobs_input}>
          <label>Email *</label>
          <input
            type="email"
            placeholder="Enter Email"
            {...register("email")}
          />
          {errors.email && (
            <div className="text-danger d-flex">
              <span style={{ marginLeft: "5px", color: "red" }}>
                {" "}
                {errors.email?.message}{" "}
              </span>
            </div>
          )}
        </div>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item md={4} sm={12} xs={12}>
              <label>Hiring End Date *</label>

              <div className={styles.date_time_input}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="end_date"
                    control={control}
                    defaultValue={null}
                    render={({
                      field: { onChange, value },
                      fieldState: { invalid },
                    }) => (
                      <MobileDatePicker
                        // label="Apply end date"
                        value={value}
                        onChange={(value) =>
                          // onChange(moment(value).format("YYYY-MM-DD HH:mm"))
                          onChange(value)
                        }
                        inputFormat="DD MMM YYYY"
                        disablePast
                        renderInput={(params) => (
                          <TextField
                            error={invalid}
                            placeholder="Select date"
                            // helperText={invalid ? error.message : null}
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
                    )}
                  />
                </LocalizationProvider>
              </div>
              {errors.end_date && (
                <div className="text-danger d-flex">
                  <span style={{ marginLeft: "5px", color: "red" }}>
                    {" "}
                    {errors.end_date?.message}{" "}
                  </span>
                </div>
              )}
            </Grid>

            <Grid item md={4} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>Company Name *</label>

                <input
                  type="text"
                  placeholder="Enter Company Name"
                  {...register("company")}
                />
                {errors.company && (
                  <div className="text-danger d-flex">
                    <span style={{ marginLeft: "5px", color: "red" }}>
                      {" "}
                      {errors.company?.message}{" "}
                    </span>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>Position *</label>
                <div className={styles.select_box}>
                  <Image src={assets.downarrow} width={10} height={10} />
                  <select {...register("position")}>
                    <option value={""}>Select Position</option>
                    {positionList.map((item, i) => (
                      <option key={i} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.position && (
                    <div className="text-danger d-flex">
                      <span style={{ marginLeft: "5px", color: "red" }}>
                        {" "}
                        {errors.position?.message}{" "}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>Require member *</label>
                <div className={styles.select_box}>
                  <Image src={assets.downarrow} width={10} height={10} />
                  <select {...register("require_member")}>
                    <option value={""}>Select Member</option>
                    {memberList.map((item, i) => (
                      <option key={i} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.require_member && (
                    <div className="text-danger d-flex">
                      <span style={{ marginLeft: "5px", color: "red" }}>
                        {" "}
                        {errors.require_member?.message}{" "}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>Job type *</label>
                <div className={styles.select_box}>
                  <Image src={assets.downarrow} width={10} height={10} />
                  <select {...register("job_type")}>
                    <option value={""}>Select Job Type</option>
                    {jobTypeList.map((item, i) => (
                      <option key={i} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.job_type && (
                    <div className="text-danger d-flex">
                      <span style={{ marginLeft: "5px", color: "red" }}>
                        {" "}
                        {errors.job_type?.message}{" "}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>Experience label *</label>
                <div className={styles.select_box}>
                  <Image src={assets.downarrow} width={10} height={10} />
                  <select {...register("experience")}>
                    <option value={""}>Select Experience</option>
                    {experienceList.map((item, i) => (
                      <option key={i} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.experience && (
                    <div className="text-danger d-flex">
                      <span style={{ marginLeft: "5px", color: "red" }}>
                        {" "}
                        {errors.experience?.message}{" "}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>Urgent *</label>
                <div className={styles.select_box}>
                  <Image src={assets.downarrow} width={10} height={10} />
                  <select {...register("isUrgent")}>
                    <option value={""}>Select Urgent</option>
                    {urgentList.map((item, i) => (
                      <option key={i} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.isUrgent && (
                    <div className="text-danger d-flex">
                      <span style={{ marginLeft: "5px", color: "red" }}>
                        {" "}
                        {errors.isUrgent?.message}{" "}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
        <div className={styles.job_location}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item md={3} sm={12} xs={12}>
                <div className={styles.jobs_input}>
                  <label>Job location *</label>
                  <div className={styles.select_box}>
                    <Image src={assets.address} width={15} height={15} />
                    
                    <Controller
                      control={control}
                      name="location"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <PlacesAutocomplete
                          name="location"
                          value={value}
                          onChange={onChange}
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
                              <input
                                name="location"
                                label="location *"
                                {...getInputProps({
                                  placeholder: "location",
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
                      )}
                    />

                    {errors.location && (
                      <div className="text-danger d-flex">
                        <span style={{ marginLeft: "5px", color: "red" }}>
                          {" "}
                          {errors.location?.message}{" "}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <div className={styles.jobs_input}>
                  <label>Country *</label>
                  <div className={styles.select_box}>
                    <Image src={assets.downarrow} width={10} height={10} />

                    <select {...register("country")}>
                      <option value={""}>Select Country</option>
                      {allCountryList?.map((item, i) => (
                        <option
                          key={i}
                          value={item?.isoCode}
                          selected={item.isoCode === watch("country")}
                          disabled = {!watch("location")}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <div className="text-danger d-flex">
                        <span style={{ marginLeft: "5px", color: "red" }}>
                          {" "}
                          {errors.country?.message}{" "}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <div className={styles.jobs_input}>
                  <label>State *</label>
                  <div className={styles.select_box}>
                    <Image src={assets.downarrow} width={10} height={10} />
                    <select {...register("city")}>
                      {formType == "Create" ? (
                        <option value={""}>Select State</option>
                      ) : null}
                      {allStateList?.data?.map((item, i) => (
                        <option key={i} value={item.name}
                        selected={item.name === watch("city")}
                        disabled = {!watch("location")}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <div className="text-danger d-flex">
                        <span style={{ marginLeft: "5px", color: "red" }}>
                          {" "}
                          {errors.city?.message}{" "}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <div className={styles.jobs_input}>
                  <label>Zipcode *</label>
                  <input
                    type="number"
                    placeholder="Enter Zipcode"
                    {...register("zipcode")}
                    disabled = {!watch("location")}
                  />
                  {errors.zipcode && (
                    <div className="text-danger d-flex">
                      <span style={{ marginLeft: "5px", color: "red" }}>
                        {" "}
                        {errors.zipcode?.message}{" "}
                      </span>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
        <div className={styles.upload_image}>
          <button onClick={handleSubmit(submitData)}>Publish</button>
        </div>
      </div>
    </>
  );
};

export default JobForm;
