import React, { useEffect, useState } from "react";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import Image from "next/image";
import assets from "@/json/assest";
import styles from "@/styles/pages/cart.module.scss";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { getToAllCartList } from "@/reduxtoolkit/cart.slice";
import { Tune } from "@mui/icons-material";
import CartItems from "./item";

var product_details = {
  dots: true,
  infinite: true,
  nav: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

function Index() {
  const dispatch = useDispatch();
  const { getCartListData } = useSelector((state) => state?.cart);

  // cart list item quantity sum all
  let item = 0;
  let quantity = 0;
  let totalPrice = 0;
  let cartList = getCartListData?.data;

  for (item; item < cartList?.length; item++) {
    quantity = quantity + parseInt(cartList[item]?.quantity);
    totalPrice += parseInt(cartList[item]?.total_price);
  }

  useEffect(() => {
    dispatch(getToAllCartList());
  }, []);

  return (
    <DashboardWrapper headerType="search" page="user">
      <div className="container">
        <div className={styles.cart_full_wrapper}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {getCartListData?.data?.length > 0 ? (
                <Grid item md={8} xs={12}>
                  <div className={styles.cart_left_wrapper}>
                    <h4>Cart</h4>

                    <>
                      {getCartListData?.data?.map((item, index) => (
                        <CartItems
                          item={item}
                          getCartListData={
                            getCartListData?.data?.length
                              ? getCartListData?.data[index]?.quantity
                              : 0
                          }
                        />
                      ))}
                    </>
                  </div>
                </Grid>
              ) : (
                <h2 style={{ textAlign: "center", width: "100%" }}>
                  No Cart Items available click{" "}
                  <Link href="/user/products">Link</Link>
                </h2>
              )}
              {getCartListData?.data?.length > 0 && (
                <Grid item md={4} xs={12}>
                  <div className={styles.cart_right_wrapper}>
                    <h2>Total</h2>
                    <ul>
                      <li>
                        <h3>Items</h3> <h4>{quantity} </h4>
                      </li>
                      {getCartListData?.data?.map((item, index) => (
                        <li>
                          <h3>Sub Total</h3>{" "}
                          <h4>
                            {item?.quantity} X {item?.product_info?.price}{" "}
                          </h4>
                        </li>
                      ))}
                      {/* <li>
                      <h3>Delivery</h3> <h4>$41.30</h4>
                    </li> */}
                      <li>
                        <h5>Grand Total</h5> <h6>${totalPrice}</h6>
                      </li>
                    </ul>
                    <Link href="/user/checkout">
                      <button>Checkout</button>
                    </Link>
                    <div className={styles.we_accept}>
                      <p>We Accept</p>
                      <ul>
                        <li>
                          <Image
                            src={assets.payment1}
                            alt="img"
                            width={27}
                            height={35}
                          />
                        </li>
                        <li>
                          <Image
                            src={assets.payment2}
                            alt="img"
                            width={27}
                            height={35}
                          />
                        </li>
                        <li>
                          <Image
                            src={assets.payment3}
                            alt="img"
                            width={27}
                            height={35}
                          />
                        </li>
                        <li>
                          <Image
                            src={assets.payment4}
                            alt="img"
                            width={27}
                            height={35}
                          />
                        </li>
                        <li>
                          <Image
                            src={assets.payment5}
                            alt="img"
                            width={27}
                            height={35}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </Grid>
              )}
            </Grid>
          </Box>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default Index;
