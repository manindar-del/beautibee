import Wrapper from "@/layout/Wrappers/Wrapper";
import styles from "@/styles/service/home.module.scss";
import Image from "next/image";
import assest from "@/json/assest";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { EffectCards } from "swiper";
import VisibilitySensor from "react-visibility-sensor";
import Box from "@mui/material/Box";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Slider from "react-slick";
import { slickOption, slickOption2 } from "@/json/slick/slick";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { useNewsLetter } from "@/hooks/useNewsLetter";
import moment from "moment";
import assets from "@/json/assest";
import {
  fetch_service_homepage_cmsData,
  fetch_blog_cmsData,
  fetch_partner_cmsData,
  fetch_testimonial_homepage_cmsData,
} from "@/api/functions/cms.api";
const Grid = dynamic(() => import("@mui/material/Grid"));

export async function getServerSideProps() {
  const res = await fetch_service_homepage_cmsData();
  const blog_res = await fetch_blog_cmsData();
  const partner_res = await fetch_partner_cmsData();
  const testimonials_res = await fetch_testimonial_homepage_cmsData();

  return {
    props: {
      serviceHomageCMSData: res?.data?.data,
      blogCMSData: blog_res?.data?.data,
      partnerCMSData: partner_res?.data?.data,
      testimonialCMSData: testimonials_res?.data?.data,
    },
  };
}

function Index({
  serviceHomageCMSData,
  blogCMSData,
  partnerCMSData,
  testimonialCMSData,
}) {
  //console.log(serviceHomageCMSData, "serviceHomageCMSData");
  // const [valueEnd, setValueEnd] = React.useState(66);

  const { mutate: NewsLetters, isSuccess } = useNewsLetter();
  const [inputData, setInputData] = useState({
    email: "",
  });
  const [error, setError] = useState({});
  const router = useRouter();

  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };

  //inputfield onchange function
  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInputData({ ...inputData, [name]: value });
  };

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

  useEffect(() => {
    if (isSuccess) {
      setInputData({
        email: "",
      });
    }
  }, [isSuccess]);

  return (
    <Wrapper page="service">
      <div className={styles.service_home}>
        <div className={styles.service_home_banner}>
          <div className={styles.bgYellow}>
            <Image
              src={assest.servicebanneryellow}
              alt="img"
              width={100}
              height={100}
              layout="responsive"
            />
          </div>
          <div className="container">
            <div className={styles.banner_inner}>
              <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                  <div className={styles.left_side}>
                    <h2>{serviceHomageCMSData.banner_title}</h2>
                    <div className={styles.tag_banner}>
                      <Image
                        src={assest.cone}
                        alt="img"
                        width={100}
                        height={100}
                      />
                      <div className={styles.tag_line}>
                        <h6>{serviceHomageCMSData.banner_subtitle}</h6>
                      </div>
                    </div>
                    <p>{serviceHomageCMSData.banner_content}</p>
                    <button
                      className={`btn btnBlack ${styles.joinbtn}`}
                      onClick={() => router.push("/service/register")}
                    >
                      Join Now
                    </button>
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className={styles.right_side}>
                    <Swiper
                      effect={"cards"}
                      grabCursor={true}
                      modules={[EffectCards]}
                      className="mySwiper"
                    >
                      {serviceHomageCMSData?.banner_images.map((item) => {
                        return (
                          <SwiperSlide>
                            <img
                              src={`${mediaPath}/uploads/cms/${item}`}
                              alt="img"
                              width={100}
                              height={100}
                              layout="responsive"
                              onError={onErrorImg}
                            />
                          </SwiperSlide>
                        );
                      })}

                      {/* <SwiperSlide>
                        {" "}
                        <img
                          src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.banner_images[1]}`}
                          alt="img"
                          width={100}
                          height={100}
                          layout="responsive"
                          onError={onErrorImg}
                        />
                      </SwiperSlide>
                      <SwiperSlide>
                        {" "}
                        <img
                          src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.banner_images[2]}`}
                          alt="img"
                          width={100}
                          height={100}
                          layout="responsive"
                          onError={onErrorImg}
                        />
                      </SwiperSlide> */}
                    </Swiper>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        <section className={styles.homePartner}>
          <div className="container">
            <h3>{serviceHomageCMSData.partner_title}:</h3>
            <ul>
              {partnerCMSData.map((item) => {
                return (
                  <li key={item?._id}>
                    <img
                      src={`${mediaPath}/uploads/partner/${item?.image}`}
                      alt="img"
                      width={134}
                      height={30}
                      onError={onErrorImg}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        <section className={styles.service_connection}>
          <div className="container">
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <div className={styles.left_conn}>
                  <h4>{serviceHomageCMSData.service_title}</h4>
                  <p>{serviceHomageCMSData.service_content}</p>
                  <button className={styles.arr_btn}>
                    <span>See more features</span>{" "}
                    <Image
                      src={assest.yellowArrow}
                      alt="img"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </Grid>
              <Grid item md={6} xs={12}>
                <div className={styles.right_conn}>
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                      <div className={styles.card}>
                        <div className={styles.card_img}>
                          <Image
                            src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.service_image_1}`}
                            alt="img"
                            width={50}
                            height={50}
                            onError={onErrorImg}
                          />
                        </div>
                        <h6>{serviceHomageCMSData.service_title_1}</h6>
                        <div className={styles.bar}></div>
                        <p>{serviceHomageCMSData.service_content_1}</p>
                      </div>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <div className={styles.card}>
                        <div className={styles.card_img}>
                          <image
                            src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.service_image_2}`}
                            alt="img"
                            width={50}
                            height={50}
                            onError={onErrorImg}
                          />
                        </div>
                        <h6>{serviceHomageCMSData.service_title_2}</h6>
                        <div className={styles.bar}></div>
                        <p>{serviceHomageCMSData.service_content_2}</p>
                      </div>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <div className={styles.card}>
                        <div className={styles.card_img}>
                          <img
                            src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.service_image_3}`}
                            alt="img"
                            width={50}
                            height={50}
                            onError={onErrorImg}
                          />
                        </div>
                        <h6>{serviceHomageCMSData.service_title_3}</h6>
                        <div className={styles.bar}></div>
                        <p>{serviceHomageCMSData.service_content_3}</p>
                      </div>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <div className={styles.card}>
                        <div className={styles.card_img}>
                          <img
                            src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.service_image_4}`}
                            alt="img"
                            width={50}
                            height={50}
                            onError={onErrorImg}
                          />
                        </div>
                        <h6>{serviceHomageCMSData.service_title_4}</h6>
                        <div className={styles.bar}></div>
                        <p>{serviceHomageCMSData.service_content_4}</p>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
        </section>
        <section className={styles.special_section}>
          <div className={styles.yellow_bg_con}>
            {serviceHomageCMSData?.special_image !== null ? (
              <img
                src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.special_image}`}
                alt="img"
                width={500}
                height={500}
                onError={onErrorImg}
              />
            ) : (
              <Image src={assets.noImage} alt="img" width={500} height={500} />
            )}
          </div>
          <div className="container">
            <Grid container spacing={2}>
              <Grid item md={6.5} xs={12}>
                <figure>
                  {serviceHomageCMSData?.special_image !== null ? (
                    <img
                      src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.special_image}`}
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
              </Grid>
              <Grid item md={5.5} xs={12} className={styles.margin_auto}>
                <div className={styles.special_right}>
                  <h4>{serviceHomageCMSData?.special_title} </h4>
                  <p>{serviceHomageCMSData?.special_content}</p>
                  <button className={styles.play_btn}>
                    <Image
                      src={assest.playbtn}
                      alt="img"
                      width={50}
                      height={50}
                    />
                  </button>
                </div>
              </Grid>
            </Grid>
          </div>
        </section>
        <section className={styles.service_section}>
          <div className={styles.service_yellow_bg}>
            <Image
              src={assest.servicehomecon2}
              alt="img"
              width={100}
              height={100}
              layout="responsive"
            />
          </div>
          <div className="container">
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <div className={styles.left_service}>
                  <h4>{serviceHomageCMSData?.feature_service_title} </h4>
                  <p>{serviceHomageCMSData?.feature_service_content}</p>
                  <button className={styles.arr_btn}>
                    <button
                      className={`btn btnBlack ${styles.joinbtn}`}
                      onClick={() => router.push("/service/register")}
                    >
                      Join Now
                    </button>{" "}
                    <Image
                      src={assest.yellowArrow}
                      alt="img"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </Grid>
              <Grid item md={6} xs={12}>
                <div className={styles.right_service}>
                  <figure>
                    <Image
                      src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.feature_service_image}`}
                      alt="img"
                      width={100}
                      height={100}
                      layout="responsive"
                      onError={onErrorImg}
                    />
                  </figure>
                  <div className={styles.progress_box}>
                    <div className={styles.progress_circle_1}>
                      <div className={styles.progress_circle_2}>
                        <VisibilitySensor>
                          {({ isVisible }) => {
                            const percentage = isVisible ? 67 : 0;
                            return (
                              <CircularProgress
                                variant="determinate"
                                value={75}
                              />
                            );
                          }}
                        </VisibilitySensor>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </section>
        <section className={styles.card_slider}>
          <div className="container">
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <div className={styles.card_slider_head}>
                  <h4>{serviceHomageCMSData?.blog_title}</h4>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={styles.card_slider_portion}>
            <Grid container spacing={2}>
              <Grid item sm={4}></Grid>
              <Grid item sm={8}>
                <div className={styles.blogSlider}>
                  <Slider {...slickOption}>
                    {blogCMSData?.map((item) => {
                      return (
                        <div key={item._id} className={styles.blogWrapper}>
                          <figure>
                            <img
                              src={`${mediaPath}/uploads/blog/${item?.image}`}
                              alt="img"
                              width={284}
                              height={234}
                              onError={onErrorImg}
                            />
                          </figure>
                          <div className={styles.newsContent}>
                            <p>{item?.title}</p>
                            <div className={styles.newcontentbottom}>
                              <span className={styles.blogusername}>
                                {moment(item?.publish_date).format("MMM Do YY")}{" "}
                              </span>
                              {/* <span className={styles.blogusername}>
                                <span>1,267,450 Views</span>
                              </span> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* <div className={styles.blogWrapper}>
                      <figure>
                        <Image
                          src={assest.blog02}
                          alt="img"
                          width={284}
                          height={234}
                        />
                      </figure>
                      <div className={styles.newsContent}>
                        <p>
                          Lorem ipsum dolor sit amet, conse ctetur adipiscing.
                        </p>
                        <div className={styles.newcontentbottom}>
                          <span className={styles.blogusername}>
                            Sarha Wild
                          </span>
                          <span className={styles.blogusername}>
                            <span>1,267,450 Views</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.blogWrapper}>
                      <figure>
                        <Image
                          src={assest.blog01}
                          alt="img"
                          width={284}
                          height={234}
                        />
                      </figure>
                      <div className={styles.newsContent}>
                        <p>
                          Lorem ipsum dolor sit amet, conse ctetur adipiscing.
                        </p>
                        <div className={styles.newcontentbottom}>
                          <span className={styles.blogusername}>
                            Sarha Wild
                          </span>
                          <span className={styles.blogusername}>
                            <span>1,267,450 Views</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.blogWrapper}>
                      <figure>
                        <Image
                          src={assest.blog03}
                          alt="img"
                          width={284}
                          height={234}
                        />
                      </figure>
                      <div className={styles.newsContent}>
                        <p>
                          Lorem ipsum dolor sit amet, conse ctetur adipiscing.
                        </p>
                        <div className={styles.newcontentbottom}>
                          <span className={styles.blogusername}>
                            Sarha Wild
                          </span>
                          <span className={styles.blogusername}>
                            <span>1,267,450 Views</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.blogWrapper}>
                      <figure>
                        <Image
                          src={assest.blog02}
                          alt="img"
                          width={284}
                          height={234}
                        />
                      </figure>
                      <div className={styles.newsContent}>
                        <p>
                          Lorem ipsum dolor sit amet, conse ctetur adipiscing.
                        </p>
                        <div className={styles.newcontentbottom}>
                          <span className={styles.blogusername}>
                            Sarha Wild
                          </span>
                          <span className={styles.blogusername}>
                            <span>1,267,450 Views</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.blogWrapper}>
                      <figure>
                        <Image
                          src={assest.blog01}
                          alt="img"
                          width={284}
                          height={234}
                        />
                      </figure>
                      <div className={styles.newsContent}>
                        <p>
                          Lorem ipsum dolor sit amet, conse ctetur adipiscing.
                        </p>
                        <div className={styles.newcontentbottom}>
                          <span className={styles.blogusername}>
                            Sarha Wild
                          </span>
                          <span className={styles.blogusername}>
                            <span>1,267,450 Views</span>
                          </span>
                        </div>
                      </div> 
                    </div> */}
                  </Slider>
                </div>
              </Grid>
            </Grid>
          </div>
        </section>
        <section className={styles.join}>
          <div className="container">
            <div className={styles.joinWrapper}>
              <figure>
                <Image src={assest.join} alt="img" width={1200} height={500} />
              </figure>
              <div className={styles.joinContent}>
                <h3>{serviceHomageCMSData?.join_title}</h3>
                <h4>{serviceHomageCMSData?.join_subtitle}</h4>
                <p>{serviceHomageCMSData?.join_content}</p>
                <button
                  className={styles.bookbtn}
                  onClick={() => router.push("/service/register")}
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.testimonialmain}>
          <div className="container">
            <Grid container spacing={2}>
              <Grid item sm={5}>
                <div className={styles.commonheading}>
                  <h4>{serviceHomageCMSData?.testimonial_title}</h4>
                </div>

                <div className={styles.blogSlider2}>
                  <Slider {...slickOption2}>
                    {testimonialCMSData.map((item) => {
                      return (
                        <div
                          key={item?._id}
                          className={styles.testimonialsilder}
                        >
                          <div className={styles.testimonialsildercontent}>
                            <p>{item?.description}</p>
                            <h4> {item?.author}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </Grid>
              <Grid item sm={7}>
                <Image
                  src={`${mediaPath}/uploads/cms/${serviceHomageCMSData?.testimonial_image}`}
                  alt="img"
                  width={100}
                  height={100}
                  layout="responsive"
                  onError={onErrorImg}
                />
              </Grid>
            </Grid>
          </div>
        </section>
        <section className={styles.newsletter}>
          <div className="container">
            <div className={styles.newsBgWrapper}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} className={styles.itemsCenter}>
                  <Grid item lg={7} xs={12}>
                    <div className={styles.newsLeft}>
                      <h3>{serviceHomageCMSData?.newsletter_title}</h3>
                      <h4>{serviceHomageCMSData?.newsletter_content}</h4>
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
      </div>
    </Wrapper>
  );
}

export default Index;
