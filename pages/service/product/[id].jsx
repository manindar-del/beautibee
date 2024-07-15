import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import assets from "@/json/assest";
import Slider from "react-slick";
import styles from "@/styles/pages/productdetails.module.scss";
import { Box, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { GetProductDetails } from "@/hooks/useProducts";
import { addToCart } from "@/reduxtoolkit/cart.slice";
import { useDispatch, useSelector } from "react-redux";
import { notiStackType } from "@/json/notiJson/notiJson";
import { useSnackbar } from "notistack";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import assest from "@/json/assest";
import { useMutation } from "react-query";

var product_details = {
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
  const { product_details_show_list } = useSelector((state) => state?.product);
  const { enqueueSnackbar } = useSnackbar();
  const [countQnt, setCountQnt] = useState(1);

  const { mutate, data } = useMutation("product", (variables) =>
    GetProductDetails(variables)
  );

  useEffect(() => {
    if (router.query.id) {
      mutate(router.query.id);
    }
  }, [router.query.id]);

  const increaseQnt = () => {
    setCountQnt(countQnt + 1);
  };
  const decreaseQnt = () => {
    if (countQnt <= 1) {
      setCountQnt(1);
    } else {
      setCountQnt(countQnt - 1);
    }
  };

  const addToCartItem = (id) => {
    const data = {
      product_id: id,
      quantity: countQnt,
    };
    dispatch(addToCart(data))
      .then((res) => {
        if (res?.payload?.status) {
          enqueueSnackbar(res?.payload?.message, notiStackType.success);
          router.push("/user/cart");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onErrorImg = (ev) => {
    ev.target.src = assest.productfullimg;
  };
  return (
    <DashboardWrapper headerType="search" page="service">
      <div className={styles.product_details_wrapper}>
        <div className="container">
          <Box sx={{ flexGrow: 1 }}>
            {data?.data?.data !== null ? (
              <>
                <Grid container spacing={2}>
                  <Grid item md={5} xs={12}>
                    <div className={styles.product_slider}>
                      <Slider {...product_details}>
                        {data?.data?.product?.images.map((index, element) => {
                          return (
                            <div>
                              <div className={styles.img_box}>
                                {data?.data?.product?.images !== null ? (
                                  <img
                                    src={`${mediaPath}/uploads/product/${data?.data?.product?.images[element]}`}
                                    width={115}
                                    height={153}
                                    onError={onErrorImg}
                                  />
                                ) : (
                                  <Image
                                    src={assets.productfullimg}
                                    alt="img"
                                    width={111}
                                    height={43}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </Slider>
                      <button
                        onClick={() => router.push("/service/product")}
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
                    <div className={styles.product_details}>
                      <h5>{data?.data?.product?.title}</h5>
                      <p>{data?.data?.category?.title}</p>
                      <h3>${data?.data?.product?.price}</h3>
                      <h4>Description</h4>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: data?.data?.product?.content,
                        }}
                      ></div>
                      {/* <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </p> */}

                      {/* <div className={styles.quantity_wrapper}>
                        <p>Quantity</p>
                        <div className={styles.quantity_wrapper_button}>
                          <button onClick={decreaseQnt}>-</button>
                          <p>{countQnt}</p>
                          <button onClick={increaseQnt}>+</button>
                        </div>
                        <p>${data?.data?.product?.price}</p>
                      </div> */}

                      {/* <div className={styles.button_group}>
                        <button
                          onClick={() =>
                            addToCartItem(data?.data?.product?._id)
                          }
                        >
                          Add To Cart
                        </button>
                        <button
                          className={styles.active}
                          onClick={() =>
                            addToCartItem(data?.data?.product?._id)
                          }
                        >
                          Buy Now
                        </button>
                      </div> */}
                    </div>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>loading...</>
            )}
          </Box>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default Index;
