import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/products.module.scss";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import assets from "@/json/assest";
import { Button } from "@mui/material";
import {
  product_show,
  product_categories_show,
} from "../../../ReduxToolkit/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import assest from "@/json/assest";
import Slider from "react-slick";
import { useGetAllProductUserList } from "@/hooks/useProduct";
import { Chip, Divider, Pagination, Stack } from "@mui/material";

const product_lists = {
  dots: false,
  infinite: true,
  nav: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  arrows: false,
};

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

function Index() {
  const dispatch = useDispatch();
  // const [value, setValue] = React.useState(0);
  const [selectCategory, setSelectCategory] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [page, setPage] = useState(1);
  const { product_categories_show_list } = useSelector(
    (state) => state?.product
  );
  const {
    data: allProductList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllProductUserList({
    category_id: selectCategory,
    pagination_page: page,
    pagination_per_page: 5,
    search: searchValue,
  });

  

  // Product categories list
  useEffect(() => {
    dispatch(product_categories_show());
  }, []);

  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };

  const handlePageChange = (event, pageValue) => {
    setPage(pageValue);
  };

  return (
    <DashboardWrapper headerType="search" page="user">
      <div className={styles.mainwraper}>
        <div className="container">
          <section className={styles.pageOrder}>
            <div className={styles.heading_sec}>
              <h3 className="headingH3">Products</h3>
            </div>
            <div className={styles.header_search_bar}>
              <div className={styles.search_field}>
                <Button>
                  <Image
                    src={assets.searchicon}
                    alt="img"
                    width={20}
                    height={20}
                  />
                </Button>
                <input
                  type="text"
                  placeholder="Search Product"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className={styles.select_cat}>
                <label>Select Category</label>
                <select
                  value={selectCategory}
                  onChange={(e) => setSelectCategory(e.target.value)}
                >
                  <option value={""}>Select Category</option>
                  {product_categories_show_list?.length > 0 ? (
                    product_categories_show_list?.map((item) => {
                      return (
                        <>
                          <option
                            key={item?._id}
                            style={{
                              color: "#000",
                              textTransform: "capitalize",
                            }}
                            value={item?._id}
                          >
                            {item?.title}
                          </option>
                        </>
                      );
                    })
                  ) : (
                    <option>No Category available</option>
                  )}
                </select>
              </div>
            </div>
            <ul className={styles.listing_sec}>
              {allProductList?.data?.length > 0 ? (
                <>
                  {allProductList?.data?.map((item, i) => (
                    <li key={i}>
                      <div className={styles.listing_box}>
                        <Slider {...product_lists}>
                          {item?.images.map((index, element) => {
                            return (
                              <div>
                                <div className={styles.productimg}>
                                  {item?.images?.length > 0 ? (
                                    <img
                                      src={`${mediaPath}/uploads/product/${item.images[element]}`}
                                      width={111}
                                      height={113}
                                      onError={onErrorImg}
                                    />
                                  ) : (
                                    <Image
                                      src={assets.noImage}
                                      alt="img"
                                      width={111}
                                      height={113}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                        <Link href={`products/${item._id}`}>
                          <div className={styles.cont_box}>
                            <h2>{item.title}</h2>
                            <h2>{item?.category_info?.title}</h2>
                            {/* <div
                              dangerouslySetInnerHTML={{
                                __html: item?.content,
                              }}
                            ></div> */}
                            <h4>${item.price}</h4>
                            <div className={styles.plusicon}> + </div>
                          </div>
                        </Link>
                      </div>
                    </li>
                  ))}
                </>
              ) : (
                <h1 style={{ textAlign: "center", width: "100%" }}>
                  No Product available
                </h1>
              )}
            </ul>
            <Stack className={styles.paginationmainone} spacing={2}>
              <Pagination
                count={allProductList?.pages}
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

export default Index;
