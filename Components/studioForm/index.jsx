import { error } from "@/json/customSms/cumtomSms";
import styles from "@/styles/service/addstudio.module.scss";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import assets from "@/json/assest";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { useSnackbar } from "notistack";
import {
  useCreateStudio,
  GetStudioDetails,
  useUpdateStudio,
  useGetAllStateMutation,
} from "@/hooks/useStudio";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import TextField from "@mui/material/TextField";
import { getAddresValue, getAddresValues } from "../serviceForm/_helpers";

export default function StudioForm({ allStudioCategory, allCountryList }) {
  const [error, setError] = useState({});
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const { useRef } = React;
  const fileRef = useRef(null);

  const [ImageOriginal, setImageOriginal] = useState(null);
  const [VideoOriginal, setVideoOriginal] = useState(null);

  const [countrySelect, setCountrySelect] = useState("");
  const [citySelect, setCitySelect] = useState("");
  const [categorySelect, setCategorySelect] = useState("");
  const [images, setImages] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const { data: allStateList, mutate } = useGetAllStateMutation();

  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [addressSelect, setAddressSelect] = useState("");
  const [countryShort, setCountryShort] = useState("");
  const [statecode, setStatecode] = useState("");
  const [stateZip, setStateZip] = useState("");
  const [countery, setCountry] = useState("");

  const [inputData, setInputData] = useState({
    name: "",
    content: "",
    price: "",
    phone: "",
    email: "",
    video:""
  });

  const { mutate: createStudio } = useCreateStudio();
  const { mutate: updateStudio } = useUpdateStudio();

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
   * The function checks if the input fields are empty or not, if empty it will return an error message
   * @returns an object.
   */
  const validation = () => {
    let error = {};
    if (!inputData.name) {
      error.name = "Studio Name is required";
    }

    if (!inputData.content) {
      error.content = "Studio Details is required";
    }

    if (!inputData.price) {
      error.price = "Price Details is required";
    }

    if (!inputData.phone) {
      error.phone = "Phone number is required";
    } else if (inputData.phone.length > 15) {
      error.phone = "Maximum 15 characters";
    } else if (inputData.phone.length < 8) {
      error.phone = "Minimum 8 characters";
    }
    var array = inputData.phone.split("");
    if (array.indexOf(".") >= 0) {
      error.phone = "Phone number is not a decimal number";
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

    if (!categorySelect) {
      error.categorySelect = "Studio Category is required";
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

    if (!stateZip) {
      error.stateZip = "Zipped Code Details is required";
    } else if (stateZip.length > 11) {
      error.stateZip = "Maximum 11 characters";
    }
    var array = stateZip.split("");
    if (array.indexOf(".") >= 0) {
      error.stateZip = " zipcode is not a decimal number";
    }


    if (!router.query.id) {
      if (uploadImage?.length == 0) {
        error.uploadImage = "Image is required";
      }
    }
    if (video === null && inputData.video ==="") {
      error.video = "Video is required";
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


  const handleSelectChangeCategory = (e) => {
    setCategorySelect(e.target.value);
  };

  /**
   * It takes the form data and sends it to the backend
   */
  const add = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      formData.append("name", inputData.name);
      formData.append("content", inputData.content);
      formData.append("price", inputData.price);
      formData.append("email", inputData.email);
      formData.append("phone", inputData.phone);
      formData.append("location", addressSelect);
      formData.append("country", countryShort);
      formData.append("city", statecode);
      formData.append("zipcode", stateZip);
      formData.append("category_id", categorySelect);
      formData.append("latitude", lat);
      formData.append("longitude", long);
  

      // if (image !== null) {
      //   formData.append("images", image);
      // }

      if (uploadImage?.length) {
        uploadImage?.map((file) => formData.append("images", file));
      }

      if (video !== null) {
        formData.append("video", video);
      }

      if (router.query.id) {
        formData.append("id", router.query.id);
        setUploadImage([]);
        updateStudio(formData);
      } else {
        createStudio(formData);
      }
    }
  };

  /* *|CURSOR_MARCADOR|* */
  useEffect(() => {
    if (router.query.id) {
      GetStudioDetails(router.query.id).then((data) => {
        console.log(data);
        setInputData({
          name: data?.data?.studio?.name,
          content: data?.data?.studio?.content,
          email: data?.data?.studio?.email,
          phone: data?.data?.studio?.phone,
          price: data?.data?.studio?.price,
          // zipcode: data?.data?.studio?.zipcode,
          // location: data?.data?.studio?.location,
          video:data?.data?.studio?.video
        });
        setCategorySelect(data?.data?.studio?.category_id);
        setStatecode(data?.data?.studio?.city);
        setCountryShort(data?.data?.studio?.country);
        //setImageOriginal(data?.data?.studio?.images[0]);
        setImages(data?.data?.studio?.images);
        setVideoOriginal(data?.data?.studio?.video);
        setAddressSelect(data?.data?.studio?.location);
        setStateZip(data?.data?.studio?.zipcode);
      });
    }
  }, [router.query.id]);

  /**
   * It takes the event.target.files, which is an array of files, and then it maps over that array and
   * pushes each file into a new array called selectedFiles
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

  // const handleImage = (e) => {
  //   {
  //     if (e.target.files[0]?.size <= 3000000) {
  //       setImage(e.target.files[0]);
  //     } else {
  //       enqueueSnackbar("Please upload image of proper size.", {
  //         variant: "error",
  //       });
  //     }
  //   }
  // };
  /**
   * It takes the file that the user has selected and sets it to the state of the video
   */
  const handleVideo = (e) => {
    if (e.target.files[0] && e.target.files[0].type === "video/mp4") {
      setVideo(e.target.files[0]);
    } else {
      enqueueSnackbar("Please upload video of proper type.", {
        variant: "error",
      });
    }
  };

  
  // useEffect(() => {
  //   if (countrySelect !== "") {
  //     mutate({
  //       location_type: "state",
  //       country_code: countrySelect,
  //       state_code: "string",
  //     });
  //   }
  // }, [countrySelect]);
  /**
   * If the image fails to load, replace it with the noImage asset
   */
  const onErrorImg = (ev) => {
    ev.target.src = assets.noImage;
  };

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
        <label>Studio Title *</label>
        <input
          name="name"
          onChange={postUserData}
          value={inputData.name}
          placeholder="Enter Studio Title"
        />
      </div>
      <div className="error">{error.name}</div>
      <div className={styles.jobs_input}>
        <label>Studio Details *</label>
        <textarea
          name="content"
          onChange={postUserData}
          value={inputData.content}
          placeholder=" Enter Studio Details"
        />
      </div>
      <div className="error">{error.content}</div>
      <div className={styles.jobs_input}>
        <label>Studio Price *</label>
        <input
          name="price"
          onChange={postUserData}
          value={inputData.price}
          placeholder="Enter Studio Price"
        />
      </div>
      <div className="error">{error.price}</div>
      <div className={styles.jobs_input}>
        <label>Phone Number *</label>
        <input
          name="phone"
          onChange={postUserData}
          value={inputData.phone}
          placeholder="Enter Phone Number"
          type="number"
        />
      </div>
      <div className="error">{error.phone}</div>
      <div className={styles.jobs_input}>
        <label>Email *</label>
        <input
          name="email"
          onChange={postUserData}
          value={inputData.email}
          placeholder=" Enter Email"
          type="email"
        />
      </div>
      <div className="error">{error.email}</div>
      <div className={styles.jobs_input}>
        <label>Studio Category *</label>
        <div className={styles.select_box}>
          <Image src={assets.downarrow} width={10} height={10} />

          <select
            value={categorySelect}
            onChange={handleSelectChangeCategory}
            name="category"
          >
            <option value={""}>Select Studio Category</option>
            {allStudioCategory?.map((item, i) => (
              <option
                value={item._id === categorySelect ? categorySelect : item._id}
                key={i}
                selected={
                  item.title === categorySelect ? categorySelect : item.title
                }
              >
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="error">{error.categorySelect}</div>
      <div className={styles.job_location}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item md={3} sm={12} xs={12}>
              <div className={styles.jobs_input}>
                <label>Studio location *</label>
                <div className={styles.select_box}>
                  <Image src={assets.address} width={15} height={15} />
                 
                  <PlacesAutocomplete
                    name="location"
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
                          name="location"
                          label="location"
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
              </div>
              <div className="error">{error.countryShort}</div>
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
              <div className={styles.jobs_input}>
                <label>Zipcode *</label>
                <input
                  type="text"
                  name="zipcode"
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
      <div className={styles.upload_image}>
        <ul>
          <li>
            <div className={styles.custom_choose_file}>
              <Image src={assets.imageuploadicon} width={30} height={30} />
              {/* video  priview */}
              {video !== "" && video !== undefined && video !== null ? (
                <video
                  src={URL.createObjectURL(video)}
                  width={100}
                  height={100}
                  className="video"
                />
              ) : (
                <video
                  src={
                    VideoOriginal !== null
                      ? `${mediaPath}/uploads/studio/videos/${VideoOriginal}`
                      : "No Video"
                  }
                  width={50}
                  height={50}
                  onError={onErrorImg}
                />
              )}
              {/* video  priview */}
              <p>Upload Studio Video *</p>
            </div>
            <input
              type="file"
              id="videofileinput"
              accept="video/*"
              onChange={handleVideo}
            />
            <div className="error">{error.video}</div>
          </li>

          <li>
            <div className={styles.custom_choose_file}>
              <Image src={assets.imageuploadicon} width={30} height={30} />
              <p>Upload Multiple Video Thumbnail *</p>
            </div>
            <input type="file" onChange={handleMultipleImages} multiple />
            <div className={styles.form_image_sec_studio}>
              {images?.length
                ? images?.map((url) => {
                    return (
                      <div className={styles.img_space_studio}>
                        {/* {console.log(url, "url**")}  */}
                        {(url !== null || url !== "") && (
                          <div className={styles.card_service}>
                            <img
                              src={`${mediaPath}/uploads/studio/images/${url}`}
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
                ? uploadImage?.map((url) => {
                    return (
                      <div className={styles.img_space_studio}>
                        {(url !== null || url !== "") && (
                          <div className={styles.card_service}>
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
            <div className="error">{error.uploadImage}</div>
          </li>
        </ul>
      </div>

      <div className={styles.upload_image}>
        <button type="button" onClick={add}>
          Submit
        </button>
      </div>
    </div>
  );
}
