import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import assets from "@/json/assest";
import Slider from "react-slick";
import styles from "@/styles/pages/productdetails.module.scss";
import { Box, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { product_details_show } from "../../../ReduxToolkit/productSlice";
import { addToCart } from "@/reduxtoolkit/cart.slice";
import { useDispatch, useSelector } from "react-redux";
import { notiStackType } from "@/json/notiJson/notiJson";
import { useSnackbar } from "notistack";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import assest from "@/json/assest";
import { getToAllCartList } from "@/reduxtoolkit/cart.slice";

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

  // Product Details list
  useEffect(() => {
    if (router.query.id) {
      dispatch(product_details_show(router.query.id));
    }
  }, [router.query.id]);

  /**
   * When the increaseQnt function is called, the countQnt state is set to the current value of countQnt
   * plus 1.
   */
  const increaseQnt = () => {
    setCountQnt(countQnt + 1);
  };
  /**
   * If the countQnt is less than or equal to 1, then set the countQnt to 1, otherwise, set the countQnt
   * to the countQnt minus 1
   */
  const decreaseQnt = () => {
    if (countQnt <= 1) {
      setCountQnt(1);
    } else {
      setCountQnt(countQnt - 1);
    }
  };

  /**
   * It takes in a product id and a quantity, and then dispatches an action to add the product to the
   * cart
   */
  const addToCartItem = (id) => {
    const data = {
      product_id: id,
      quantity: countQnt,
    };
    dispatch(addToCart(data))
      .then((res) => {
        if (res?.payload?.status) {
          dispatch(getToAllCartList());
          enqueueSnackbar(res?.payload?.message, notiStackType.success);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // It is for buy now button function
  const addToCartItemForBuyNow = (id) => {
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

  /**
   * A function that is called when an image fails to load.
   */
  const onErrorImg = (ev) => {
    ev.target.src = assest.productfullimg;
  };

  return (
    <DashboardWrapper headerType="search" page="user">
      <div className={styles.product_details_wrapper}>
        <div className="container">
          <Box sx={{ flexGrow: 1 }}>
            {product_details_show_list !== null ? (
              <>
                <Grid container spacing={2}>
                  <Grid item md={5} xs={12}>
                    <div className={styles.product_slider}>
                      <Slider {...product_details}>
                        {product_details_show_list?.images.map(
                          (element, index) => {
                            return (
                              <div>
                                <div className={styles.img_box}>
                                  {product_details_show_list?.images !==
                                  null ? (
                                    <img
                                      src={`${mediaPath}/uploads/product/${product_details_show_list?.images[index]}`}
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
                          }
                        )}
                      </Slider>
                      <button
                        onClick={() => router.push("/user/products")}
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
                      <h5>{product_details_show_list.title}</h5>

                      <h3>${countQnt * product_details_show_list.price}</h3>
                      <h4>Description</h4>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product_details_show_list?.content,
                        }}
                      ></div>
                      {/* <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </p> */}

                      <div className={styles.quantity_wrapper}>
                        <p>Quantity</p>
                        <div className={styles.quantity_wrapper_button}>
                          <button onClick={decreaseQnt}>-</button>
                          <p>{countQnt}</p>
                          <button onClick={increaseQnt}>+</button>
                        </div>
                        <p>${product_details_show_list.price}</p>
                      </div>

                      <div className={styles.button_group}>
                        <button
                          onClick={() =>
                            addToCartItem(product_details_show_list?._id)
                          }
                        >
                          Add To Cart
                        </button>
                        <button
                          className={styles.active}
                          onClick={() =>
                            addToCartItemForBuyNow(
                              product_details_show_list?._id
                            )
                          }
                        >
                          Buy Now
                        </button>
                      </div>
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
