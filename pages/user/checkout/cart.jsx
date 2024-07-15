import React, { useEffect, useState } from "react";
import Image from "next/image";
import assets from "@/json/assest";
import styles from "@/styles/pages/checkout.module.scss";
import { Box, Grid } from "@mui/material";
import {
  getToAllCartList,
  deleteToCart,
  updateToCart,
} from "@/reduxtoolkit/cart.slice";

import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { notiStackType } from "@/json/notiJson/notiJson";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";

// sliders variable
var product_details = {
  dots: false,
  infinite: true,
  nav: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
};

export default function Cart({ item, getCartListData }) {
  // Quantity state, here  parseInt use item quantity parse string and return integer
  const [countQnt, setCountQnt] = useState(parseInt(item?.quantity || 1));
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  // delete cart item using cart id
  const deleteToCartItem = (id) => {
    dispatch(deleteToCart(id))
      .then((res) => {
        if (res?.payload?.status === 200) {
          dispatch(getToAllCartList());
          enqueueSnackbar(res?.payload?.message, notiStackType.success);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Increase cart quantity
  const increaseQnt = (id) => {
    let data = {
      cart_id: id,
      quantity: countQnt + 1,
    };

    dispatch(updateToCart(data));
    dispatch(getToAllCartList(data))
      .then((res) => {
        if (res?.payload?.status === 200) {
          setCountQnt(countQnt + 1);
          enqueueSnackbar(res?.payload?.message, notiStackType.success);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // Decrease cart quantity
  const decreaseQnt = (id) => {
    if (countQnt <= 1) {
      setCountQnt(1);
    } else {
      let data = {
        cart_id: id,
        quantity: countQnt - 1,
      };

      dispatch(updateToCart(data));
      dispatch(getToAllCartList(data))
        .then((res) => {
          if (res?.payload?.status === 200) {
            setCountQnt(countQnt - 1);
            enqueueSnackbar(res?.payload?.message, notiStackType.success);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

   // Default image show
  const onErrorImg = (ev) => {
    ev.target.src = assets.productfullimg;
  };

  return (
    <div className={styles.cart_listing}>
      <div className={styles.cart_details}>
        <div className={styles.cart_details_left}>
          <Slider {...product_details}>
            {item?.product_info?.images?.map((element, index) => {
              return (
                <div className={styles.cart_details_left_img}>
                  {item?.product_info?.images !== null ? (
                    <img
                      src={`${mediaPath}/uploads/product/${item?.product_info?.images[index]}`}
                      width={92}
                      height={70}
                      onError={onErrorImg}
                    />
                  ) : (
                    <Image
                      src={assets.productfullimg}
                      alt="img"
                      width={92}
                      height={70}
                    />
                  )}
                </div>
              );
            })}
          </Slider>
        </div>
        <div className={styles.cart_details_left_txt}>
          <h4>{item?.product_info?.title}</h4>${item?.product_info?.price}
          <h5>
            <div className={styles.cart_details_right}>
              <button onClick={() => decreaseQnt(item?._id)}>-</button>
              <p>{getCartListData ? getCartListData : countQnt}</p>
              <button onClick={() => increaseQnt(item?._id)}>+</button>
            </div>
          </h5>
        </div>

        <div className={styles.close_btn}>
          <button onClick={() => deleteToCartItem(item?._id)}>
            <Image src={assets?.closeBtn} width={7} height={7} />
          </button>
        </div>
      </div>
    </div>
  );
}
