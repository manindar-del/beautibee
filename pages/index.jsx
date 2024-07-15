//**  PROJECT IMPORTS   */
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/pages/home.module.scss";
import Link from "next/link";
import Slider from "react-slick";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import assets from "@/json/assest";
import { number, string, arrayOf, shape, oneOfType } from "prop-types";
import Box from "@mui/material/Box";
import Image from "next/image";
import {
  fetch_homepage_cmsData,
  fetch_blog_cmsData,
  fetch_partner_cmsData,
  fetch_product_categories_cmsData,
} from "@/api/functions/cms.api";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import moment from "moment";
import assest from "@/json/assest";
import { useNewsLetter } from "@/hooks/useNewsLetter";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Cookies } from "react-cookie";

import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import { useGetListServiceListingSubmit } from "@/hooks/useSearchListing";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";

//**  DYNAMIC IMPORTS   */
const Grid = dynamic(() => import("@mui/material/Grid"));

const Wrapper = dynamic(() => import("@/layout/Wrappers/Wrapper"));

var settings = {
  dots: false,
  infinite: false,
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  speed: 2000,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1008,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
var blog = {
  dots: false,
  infinite: true,
  slidesToShow: 2.5,
  slidesToScroll: 1,
  speed: 2000,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1008,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export async function getServerSideProps() {
  const res = await fetch_homepage_cmsData();
  const blog_res = await fetch_blog_cmsData();
  const partner_res = await fetch_partner_cmsData();
  const pdt_categories_res = await fetch_product_categories_cmsData();

  return {
    props: {
      homepageCMSData: res?.data?.data,
      blogCMSData: blog_res?.data?.data,
      partnerCMSData: partner_res?.data?.data,
      categoriesCMSData: pdt_categories_res?.data?.data,
    },
  };
}

const schema = yup.object({});

export default function Home({
  homepageCMSData,
  blogCMSData,
  partnerCMSData,
  categoriesCMSData,
}) {
  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };
  const [email, setEamil] = useState("");
  const { mutate: NewsLetters, isSuccess } = useNewsLetter();
  const [inputData, setInputData] = useState({
    email: "",
  });
  const [error, setError] = useState({});

  const cookie = new Cookies();
  const token = cookie.get("token");
  const userDetails = cookie.get("userDetails");
  const router = useRouter();

  //inputfield onchange function
  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  useEffect(() => {
    if (isSuccess) {
      setInputData({
        email: "",
      });
    }
  }, [isSuccess]);

  const validation = () => {
    let error = {};
    if (!inputData.email) {
      error.email = "Email address is required";
    } else if (
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        inputData.email
      )
    ) {
      error.email = "Enter a valid email";
    }

    return error;
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleNewsletter = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      formData.append("email", inputData.email);
      NewsLetters(formData);
    }
  };

  const { data: allServiceSearchLists, mutate: searchListingSubmit } =
    useGetListServiceListingSubmit();

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

  const submitData = (data) => {
    searchListingSubmit({
      ...data,
      latitude: data.lat,
      longitude: data.long,
      customer_id: userDetails?.data?._id,
      search_title: data.expertis,
    });

    router.push(
      `/search-provider?search_title=${data.expertis}&latitude=${data.lat}&longitude=${data.long}`
    );
  };

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
        setValue("lat", latLng?.lat);
        setValue("long", latLng?.lng);
      })
      //.then(latLng => console.log('Success', latLng))
      .catch((error) => {});
  };

  return (
    <Wrapper>
      <title>Home</title>
      <section className={styles.homepage_banner}>
        <div className={styles.bgYellow}></div>
        <div className="container">
          <div className={styles.bannerWrapper}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} className={styles.itemsCenter}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <div className={styles.bannerContentLeft}>
                    <h1>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: homepageCMSData?.banner_title,
                        }}
                      ></div>
                    </h1>
                    <p>{homepageCMSData.banner_content}</p>
                    <div className={styles.bannerSearch}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid
                          container
                          spacing={2}
                          className={styles.itemsCenter}
                        >
                          <Grid item lg={5} xs={12}>
                            <input
                              type="text"
                              placeholder="Service, Stylist or Salon"
                              {...register("expertis")}
                            />
                          </Grid>
                          <Grid item lg={4} xs={12}>
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
                                            {suggestions.map(
                                              (suggestion, i) => {
                                                const className =
                                                  suggestion.active
                                                    ? "suggestion-item--active"
                                                    : "suggestion-item";
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                  ? {
                                                      backgroundColor:
                                                        "#fafafa",
                                                      cursor: "pointer",
                                                    }
                                                  : {
                                                      backgroundColor:
                                                        "#ffffff",
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
                                              }
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </PlacesAutocomplete>
                                  )}
                                />
                              </Typography>
                            </Popover>
                          </Grid>
                          <Grid item lg={3} xs={12}>
                            <button
                              onClick={handleSubmit(submitData)}
                              className="btn btnYellow"
                            >
                              Search
                            </button>
                          </Grid>
                        </Grid>
                      </Box>
                    </div>
                  </div>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <div className={styles.bannerContentRight}>
                    {/* <Image
                      src={assets.ban01}
                      alt="img"
                      width={500}
                      height={500}
                    /> */}
                    {homepageCMSData?.banner_image !== null ? (
                      <img
                        src={`${mediaPath}/uploads/cms/${homepageCMSData?.banner_image}`}
                        alt="img"
                        width={500}
                        height={500}
                        onError={onErrorImg}
                      />
                    ) : (
                      <Image
                        src={assets.noImage}
                        alt="img"
                        width={500}
                        height={500}
                      />
                    )}
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </section>
      <section className={styles.homeProductSlider}>
        <div className="container">
          <Slider {...settings}>
            {categoriesCMSData.map((item) => {
              return (
                <div
                  key={item._id}
                  className={`${styles.sliderBox} ${styles.bglightSky}`}
                >
                  <figure>
                    {item?.image !== null ? (
                      <img
                        src={`${mediaPath}/uploads/product_category/${item?.image}`}
                        alt="img"
                        width={72}
                        height={70}
                        onError={onErrorImg}
                      />
                    ) : (
                      <Image
                        src={assets.noImage}
                        alt="img"
                        width={72}
                        height={70}
                      />
                    )}
                  </figure>
                  <p>{item.title}</p>
                </div>
              );
            })}
            {/* <div className={styles.sliderBox}>
              <figure>
                <Image src={assets.slide02} alt="img" width={66} height={70} />
              </figure>
              <p>Skin Care</p>
            </div>
            <div className={`${styles.sliderBox} ${styles.bglightYellow}`}>
              <figure>
                <Image src={assets.slide03} alt="img" width={57} height={70} />
              </figure>
              <p>Lips Care</p>
            </div>
            <div className={`${styles.sliderBox} ${styles.bglightPink}`}>
              <figure>
                <Image src={assets.slide04} alt="img" width={70} height={70} />
              </figure>
              <p>Face skin</p>
            </div>
            <div className={`${styles.sliderBox} ${styles.bglightRed}`}>
              <figure>
                <Image src={assets.slide05} alt="img" width={70} height={70} />
              </figure>
              <p>Blusher</p>
            </div>
            <div className={`${styles.sliderBox} ${styles.bglightBlue}`}>
              <figure>
                <Image src={assets.slide06} alt="img" width={63} height={70} />
              </figure>
              <p>Natural</p>
            </div>
            <div className={`${styles.sliderBox} ${styles.bglightSky}`}>
              <figure>
                <Image src={assets.slide01} alt="img" width={72} height={70} />
              </figure>
              <p>care new</p>
            </div> */}
          </Slider>
        </div>
      </section>
      <section className={styles.bookService}>
        <div className={styles.beforeImg}>
          <Image src={assets.round} alt="img" width={43} height={104} />
        </div>
        <div className="container">
          <div className={styles.serviceHeader}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} className={styles.itemsEnd}>
                <Grid item lg={9} xs={12}>
                  <div className={styles.headerColumnLeft}>
                    <div className={styles.social}>
                      <span>Facebook</span>
                      <span>Instagram</span>
                    </div>
                  </div>
                </Grid>
                <Grid item lg={3} xs={12}>
                  <div className={styles.headerColumnRight}>
                    <p>phongpham1292@gmail.com</p>
                    <h5>
                      <span>+</span>630 229 1680
                    </h5>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} className={styles.itemsCenter}>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <div className={styles.serviceImg}>
                  <div className={styles.floatLeaf}>
                    <Image
                      src={assets.leaf}
                      alt="img"
                      width={106}
                      height={77}
                    />
                  </div>
                  <div className={styles.offerWrap}>
                    <figure>
                      {/* <Image
                        src={assets.book}
                        alt="img"
                        width={482}
                        height={483}
                      /> */}
                      {homepageCMSData?.booking_image !== null ? (
                        <Image
                          src={`${mediaPath}/uploads/cms/${homepageCMSData?.booking_image}`}
                          alt="img"
                          width={500}
                          height={500}
                          onError={onErrorImg}
                        />
                      ) : (
                        <Image
                          src={assets.noImage}
                          alt="img"
                          width={500}
                          height={500}
                        />
                      )}
                    </figure>
                    <div className={styles.secviceOffer}>
                      <div className={styles.topOff}>
                        <p>Offer</p>
                        <h4>
                          $25% <span>Off</span>
                        </h4>
                      </div>
                      <div className={styles.bottomOff}>
                        <h3>For Store</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <div className={styles.serviceContent}>
                  <div className={styles.beforeBee}>
                    <Image
                      src={assets.Bee}
                      alt="img"
                      width={235}
                      height={183}
                    />
                  </div>
                  <h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: homepageCMSData?.booking_title,
                      }}
                    ></div>
                  </h2>
                  <p>{homepageCMSData?.booking_content}</p>
                  <Link href="/search-provider">
                    <button className={styles.bookbtn}>
                      Book Now <span>+</span>
                    </button>
                  </Link>
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
      </section>
      <section className={styles.homeBlog}>
        <div className="container">
          <div className={`${styles.blogPostMain} ${styles.blogPostMain_home}`}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item lg={7.5} xs={12}>
                  <div className={styles.blogSlider}>
                    <Slider {...blog}>
                      {blogCMSData?.map((item) => {
                        return (
                          <div key={item._id} className={styles.blogWrapper}>
                            <figure>
                              {item?.image !== null ? (
                                <img
                                  src={`${mediaPath}/uploads/blog/${item?.image}`}
                                  alt="img"
                                  width={284}
                                  height={234}
                                  onError={onErrorImg}
                                />
                              ) : (
                                <Image
                                  src={assets.noImage}
                                  alt="img"
                                  width={284}
                                  height={234}
                                />
                              )}
                            </figure>

                            <div className={styles.newsContent}>
                              <h4>{item?.title}</h4>
                              <p>
                                {moment(item?.publish_date).format("MMM Do YY")}{" "}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                </Grid>
                <Grid item lg={4.5} xs={12}>
                  <div
                    className={`${styles.showBlogDescription} ${styles.showBlogDescription_home}`}
                  >
                    <h3> {homepageCMSData?.blog_title}</h3>
                    <h4>{homepageCMSData?.blog_subtitle}</h4>
                    <p>{homepageCMSData?.blog_content}</p>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </section>
      <section className={styles.homePartner}>
        <div className="container">
          <h3> {homepageCMSData?.partner_title}:</h3>
          <ul>
            {partnerCMSData.map((item) => {
              return (
                <li key={item._id}>
                  {item?.image !== null ? (
                    <img
                      src={`${mediaPath}/uploads/partner/${item?.image}`}
                      alt="img"
                      width={134}
                      height={30}
                      onError={onErrorImg}
                    />
                  ) : (
                    <Image
                      src={assets.noImage}
                      alt="img"
                      width={134}
                      height={30}
                    />
                  )}
                </li>
              );
            })}
            {/* <li>
              <Image src={assets.partner02} alt="img" width={115} height={48} />
          </li> */}
          </ul>
        </div>
      </section>
      <section className={styles.join}>
        <div className="container">
          <div className={styles.joinWrapper}>
            <figure>
              <Image src={assets.join} alt="img" width={1200} height={500} />
            </figure>
            <div className={styles.joinContent}>
              <h3> {homepageCMSData?.join_title}</h3>
              <h4>{homepageCMSData?.join_subtitle}</h4>
              <p>{homepageCMSData?.join_content}</p>
              <Link href="/service/register">
                <button className={styles.bookbtn}>Join Now</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
     
      <section className={styles.bookAppoinment}>
        <div className="container">
          <div className={styles.appoinment}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <div className={styles.appoinmentLeft}>
                    <h3> {homepageCMSData?.appointment_title} </h3>
                    <p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: homepageCMSData?.appointment_content,
                        }}
                      ></div>
                    </p>
                    <h5>{homepageCMSData?.appointment_subtitle}</h5>
                    <div className={styles.getLink}>
                      <input
                        type="phone"
                        placeholder="Enter mobile number..."
                      />
                      <button className="btn btnYellow">Get link</button>
                    </div>
                  </div>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <div className={styles.appoinmentRight}>
                    <div className={styles.phoneImg}>
                      <Image
                        src={assets.phone}
                        alt="img"
                        width={288}
                        height={299}
                      />
                    </div>
                    <div className={styles.appoBooking}>
                      <h3>Book a parlour</h3>
                      {/* <p>Lorem ipsum dolor sit amet</p> */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2} className={styles.matTop}>
                          <Grid item lg={5} md={5} sm={5} xs={12}>
                            <div className={styles.parColumn}>
                              <figure>
                               
                                {homepageCMSData?.appointment_image !== null ? (
                                  <img
                                    src={`${mediaPath}/uploads/cms/${homepageCMSData?.appointment_image}`}
                                    alt="img"
                                    width={134}
                                    height={30}
                                    onError={onErrorImg}
                                  />
                                ) : (
                                  <Image
                                    src={assets.noImage}
                                    alt="img"
                                    width={134}
                                    height={30}
                                  />
                                )}
                              </figure>
                              {/* <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and type setting.
                              </p> */}
                            </div>
                          </Grid>
                          <Grid item lg={5} md={5} sm={5} xs={12}>
                            <div className={styles.smAbout}>
                              <figure>
                                <Image
                                  src={assets.about}
                                  alt="img"
                                  width={64}
                                  height={64}
                                />
                              </figure>
                              <h6>What to talk about ?</h6>
                              {/* <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and type setting.Lorem Ipsum is simply dummy.
                              </p> */}
                            </div>
                          </Grid>
                        </Grid>
                      </Box>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </section>
      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsBgWrapper}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} className={styles.itemsCenter}>
                <Grid item lg={7} xs={12}>
                  <div className={styles.newsLeft}>
                    <h3>{homepageCMSData?.newsletter_title}</h3>
                    <h4>{homepageCMSData?.newsletter_content}</h4>
                  </div>
                </Grid>
                <Grid item lg={5} xs={12}>
                  <div className={styles.newsRight}>
                    <input
                      type="email"
                      name="email"
                      onChange={postUserData}
                      value={inputData.email}
                      placeholder="Email address"
                    />

                    <button
                      onClick={handleNewsletter}
                      className={styles.submitemial}
                    >
                      <ArrowForwardIcon />
                    </button>
                  </div>
                  <div className="error">{error.email}</div>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </section>
    </Wrapper>
  );
}

//*   Proptype check

Home.propTypes = {
  data: arrayOf(
    shape({
      category: string,
      description: string,
      id: number,
      image: string,
      title: string,
      price: oneOfType([string, number]),
      rating: shape({
        rate: number,
        count: number,
      }),
    })
  ),
};
