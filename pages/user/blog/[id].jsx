import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import assets from "@/json/assest";
import Slider from "react-slick";
import styles from "@/styles/pages/productdetails.module.scss";
import { Box, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { blog_details_show } from "../../../ReduxToolkit/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import assest from "@/json/assest";

var blog_details = {
  dots: true,
  infinite: true,
  nav: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { blog_details_show_list } = useSelector((state) => state?.blog);
  // console.log(blog_details_show_list, "blog_details_show_list");

  // Blog Details list
  useEffect(() => {
    if (router.query.id) {
      dispatch(blog_details_show(router.query.id));
    }
  }, [router.query.id]);

  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };

  return (
    <DashboardWrapper headerType="search" page="user">
      <div className={styles.product_details_wrapper}>
        <div className="container">
          <Box sx={{ flexGrow: 1 }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={5} xs={12}>
                  <div className={styles.product_slider}>
                    <Slider {...blog_details}>
                      {}

                      <div>
                        <div className={styles.img_box}>
                          {blog_details_show_list.image ? (
                            <>
                              <img
                                src={`${mediaPath}/uploads/blog/${blog_details_show_list.image}`}
                                alt="img"
                                width={485}
                                height={485}
                                layout="responsive"
                                onError={onErrorImg}
                              />
                            </>
                          ) : (
                            <>
                              <Image
                                src={assest.noImage}
                                alt="img"
                                width={485}
                                height={485}
                                layout="responsive"
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className={styles.img_box}>
                          {blog_details_show_list.image ? (
                            <>
                              <img
                                src={`${mediaPath}/uploads/blog/${blog_details_show_list.image}`}
                                alt="img"
                                width={485}
                                height={485}
                                layout="responsive"
                                onError={onErrorImg}
                              />
                            </>
                          ) : (
                            <>
                              <Image
                                src={assest.noImage}
                                alt="img"
                                width={485}
                                height={485}
                                layout="responsive"
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className={styles.img_box}>
                          {blog_details_show_list.image ? (
                            <>
                              <img
                                src={`${mediaPath}/uploads/blog/${blog_details_show_list.image}`}
                                alt="img"
                                width={485}
                                height={485}
                                layout="responsive"
                                onError={onErrorImg}
                              />
                            </>
                          ) : (
                            <>
                              <Image
                                src={assest.noImage}
                                alt="img"
                                width={485}
                                height={485}
                                layout="responsive"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </Slider>

                    <button
                      onClick={() => router.push("/user/blog")}
                      className={styles.back_button}
                    >
                      <Image
                        src={assets.rightarrowgray}
                        width={17}
                        height={12}
                      />
                    </button>
                  </div>
                </Grid>

                <Grid item md={7} xs={12}>
                  <div className={styles.blog_details}>
                    <h2>{blog_details_show_list.title}</h2>
                    <h1>Description</h1>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: blog_details_show_list?.content,
                      }}
                    ></div>
                  </div>
                </Grid>
              </Grid>
            </>
          </Box>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default Index;
