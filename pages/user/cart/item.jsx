import React, { useEffect, useState } from "react";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import assets from "@/json/assest";
import { useSnackbar } from "notistack";
import assest from "@/json/assest";
import Image from "next/image";
import styles from "@/styles/pages/cart.module.scss";
import {
  getToAllCartList,
  deleteToCart,
  updateToCart,
} from "@/reduxtoolkit/cart.slice";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { notiStackType } from "@/json/notiJson/notiJson";
import { Abc } from "@mui/icons-material";

// slider variable
var product_details = {
  dots: false,
  infinite: true,
  nav: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
};

export default function CartItems({ item, getCartListData }) {
  const dispatch = useDispatch();
  const [countQnt, setCountQnt] = useState(parseInt(item?.quantity || 1));
  const { enqueueSnackbar } = useSnackbar();

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
  const increaseQnt = (id, index) => {
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
    ev.target.src = assest.productfullimg;
  };

  return (
    <div>
      <div className={styles.cart_listing}>
        <div className={styles.cartDetailsSlider}>
          <Slider {...product_details}>
            {item?.product_info?.images?.map((element, index) => {
              return (
                <div className={styles.cart_details_left_img}>
                  {item?.product_info?.images !== null ? (
                    <img
                      src={`${mediaPath}/uploads/product/${item?.product_info?.images[index]}`}
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
              );
            })}
          </Slider>
        </div>
        <div className={styles.cart_details}>
          <div className={styles.cart_details_left}>
            <div className={styles.cart_details_left_txt}>
              <h4>{item?.product_info?.title}</h4>
              <h5>${item?.product_info?.price}</h5>
            </div>
          </div>

          <div className={styles.cart_details_right}>
            <button onClick={() => decreaseQnt(item?._id)}>-</button>
            <p>{getCartListData ? getCartListData : countQnt}</p>

            <button
              onClick={() => {
                increaseQnt(item?._id);
              }}
            >
              +
            </button>
          </div>

          <div className={styles.close_btn}>
            <button onClick={() => deleteToCartItem(item?._id)}>
              <Image src={assets?.closeBtn} width={7} height={7} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
