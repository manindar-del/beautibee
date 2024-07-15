import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/blog.module.scss";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import assets from "@/json/assest";
import { Button } from "@mui/material";
import { blog_show } from "../../../ReduxToolkit/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { Stack } from "@mui/system";
import {Pagination } from "@mui/material";
import assest from "@/json/assest";

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

function index() {
  const dispatch = useDispatch();


  const [page, setPage] = useState(1);
  const { blog_list } = useSelector((state) => state?.blog);
  //console.log(blog_list, "blog_list");

  // Blog list
  useEffect(() => {
    dispatch(
      blog_show({
        pagination_page: page,
        pagination_per_page: 5,
      })
    );
  }, [page]);

  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };
  /**
   * The function takes in an event and a pageValue, and then sets the page to the pageValue
   */
  const handlePageChange = (event, pageValue) => {
    setPage(pageValue);
  };


  const truncateString = (str, length) => {
    if (str?.length) {
      if (str?.length < length) {
        return str;
      }
  
      return `${str.substring(0, length)  }...`;
    }
  
    return str;
  };


  return (
    <DashboardWrapper headerType="search" page="user">
      <div className={styles.mainwraper}>
        <div className="container">
          <section className={styles.pageOrder}>
            <div className={styles.heading_sec}>
              <h3 className="headingH3">Blog</h3>
            </div>

            <ul className={styles.listing_sec}>
              {blog_list?.data !== null ? (
                <>
                  {blog_list?.data.map((item, i) => (
                    <li key={i}>
                      <Link href={`blog/${item._id}`}>
                        <div className={styles.listing_box}>
                          <div className={styles.productimg}>
                            {/* <Image
                              src={`${mediaPath}/uploads/blog/${item.image}`}
                              alt="img"
                              width={111}
                              height={43}
                            /> */}

                                 {item.image ? (
                                  <>
                                    <img
                                    src={`${mediaPath}/uploads/blog/${item.image}`}
                                      alt="img"
                                      width={111}
                                      height={43}
                                      layout="responsive"
                                      onError={onErrorImg}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Image
                                      src={assest.noImage}
                                      alt="img"
                                      width={111}
                                      height={43}
                                      layout="responsive"
                                     
                                    />
                                  </>
                                )}

                          </div>
                          <div className={styles.cont_box}>
                            <h2>{item.title}</h2>
                            <div
                              dangerouslySetInnerHTML={{
                                __html:  truncateString(item?.content, 100),
                              }}
                            ></div>

                            <div className={styles.plusicon}> + </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </>
              ) : (
                <>loading...</>
              )}
            </ul>
            <Stack className={styles.paginationmainone} spacing={2}>
              <Pagination
                count={blog_list?.pages}
                variant="outlined"
                color="primary"
                page={page}
                onChange={handlePageChange}
              />
            </Stack>
          </section>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default index;
