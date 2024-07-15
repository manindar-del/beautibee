import Image from "next/image";
import React, { useState, useEffect } from "react";
import styles from "@/styles/layout/dashboardheader.module.scss";
import assest from "@/json/assest";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import LogoutIcon from "@mui/icons-material/Logout";
import { handleLoggedout } from "@/reduxtoolkit/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { Cookies } from "react-cookie";
import { getToAllCartList } from "@/reduxtoolkit/cart.slice";
import { switchUserAccount } from "@/hooks/useProfile";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetListServiceListingSubmit } from "@/hooks/useSearchListing";
import Seo from "@/components/SEO/Seo";
import useUser from "@/hooks/useAutomaticLogout";

const schema = yup.object({});

const SearchHeader = ({ page }) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { data: allServiceSearchLists, mutate: searchListingSubmit } =
    useGetListServiceListingSubmit();

  const dispatch = useDispatch();
  const { getCartListData } = useSelector((state) => state?.cart);
  const router = useRouter();
  const { getProfileData } = useSelector((store) => store.profile);
  const [profileImageOriginal, setProfileImageOriginal] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const cookie = new Cookies();
  const token = cookie.get("token");
  let userDetails = cookie.get("userDetails");
  // logoutUser
  const { isLoading } = useUser();

  const { data: switchingUser, mutate: ChangeUser } = switchUserAccount();

  // Change user-type get data from cookie set in api call
  let switchingUserData = cookie.get("userchnagess");

  useEffect(() => {
    if (getProfileData !== undefined) {
      setProfileImage(getProfileData?.profile_image);
    }
  }, [getProfileData]);

  useEffect(() => {
    if (getProfileData !== undefined) {
      setProfileImageOriginal(getProfileData?.business_image);
    }
  }, [getProfileData]);

  const onErrorImg = (ev) => {
    ev.target.src = assest.profile1;
  };

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

  const userchangable = () => {
    ChangeUser({
      isCustomer: false,
    });

    if (
      userDetails?.data?.account_verified === true &&
      userDetails?.data?.isSignupCompleted === true
    ) {
      router.push("/service/dashboard");
    } else {
      router.push("/service/account");
    }
  };

  const technicianChange = () => {
    ChangeUser({
      isCustomer: true,
    });
    router.push("/search-provider");
  };

  const submitData = (data) => {
    searchListingSubmit({
      ...data,
      customer_id: userDetails?.data?._id,
      search_title: data.expertis,
    });

    router.push(`/search-provider?search_title=${data.expertis}`);
  };

  const capitalizeWords = (str) => {
    if (typeof str === "string") {
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else if (Array.isArray(str)) {
      const capitalizedArray = str.map((word) => {
        return word.toLowerCase().charAt(0).toUpperCase() + word.slice(1);
      });
      return capitalizedArray.join(" ");
    }
  };

  const projectName = "BeautiBee";
  const routerText = router.pathname.split("/");
  routerText.shift();
  const favText = capitalizeWords(routerText);

  return (
    <div>
      <Seo
        title={
          router.pathname === "/"
            ? `${projectName}`
            : `${projectName} | ${favText}`
        }
        canonical=""
        description=""
        url=""
        image=""
      />
      {page === "user" ? (
        <>
          <div className={styles.dash_header}>
            <div className="container">
              <div className={styles.header_content}>
                <div className={styles.logo}>
                  <Link href="/">
                    {/* <img src="./assets/images/logo.svg" alt="" /> */}
                    <Image
                      src={assest.logo}
                      alt="img"
                      width={100}
                      height={100}
                    />
                  </Link>
                </div>
                <div className={styles.search_field}>
                  <input
                    type="text"
                    placeholder="Service, Stylist or Salon"
                    {...register("expertis")}
                  />

                  <Button>
                    <Image
                      src={assest.search}
                      alt="img"
                      width={20}
                      height={20}
                      onClick={handleSubmit(submitData)}
                    />
                  </Button>
                </div>
                {/* customer header */}


                {token?.length === null || token === undefined ?

                  <Button className={styles.beauti_btn} onClick={() => router.push("/service")}>
                    Become a Beautibee
                  </Button>
                  :

                  <Button className={styles.beauti_btn} onClick={userchangable}>
                    {switchingUserData === "Both"
                      ? "Switch"
                      : userDetails?.data?.user_type === "Both"
                        ? " Switch"
                        : "Become a Beautibee"}

                  </Button>
                }
                {token?.length === null || token === undefined ? (
                  <>
                    <button
                      className="btn btnBlack logbtn dsk_login"
                      onClick={() => router.push("/login")}
                    >
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      className={styles.cart}
                      onClick={() => router.push("/user/cart")}
                    >
                      <Image
                        src={assest.cart}
                        alt="img"
                        width={20}
                        height={20}
                      />
                      <div className={styles.carts_quantity}>{quantity}</div>
                    </Button>
                    <Button
                      className={styles.cart}
                      onClick={() => router.push("/chat")}
                    >
                      <Image
                        src={assest.msg}
                        alt="img"
                        width={20}
                        height={20}
                      />
                    </Button>
                    <Button
                      className={styles.user_btn}
                      onClick={() => router.push("/user/dashboard/account")}
                    >
                      <img
                        src={
                          profileImage !== null
                            ? `${mediaPath}/uploads/user/profile_pic/${profileImage}`
                            : assest.noImage
                        }
                        width={105}
                        height={105}
                        onError={onErrorImg}
                      />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.dash_header}>
            <div className="container">
              <div className={styles.header_content}>
                <div className={styles.logo}>
                  <Link href="/service">
                    {/* <img src="./assets/images/logo.svg" alt="" /> */}
                    <Image
                      src={assest.logo}
                      alt="img"
                      width={100}
                      height={100}
                    />
                  </Link>
                </div>
                <div className={styles.search_field}>
                  <input
                    type="text"
                    placeholder="Service, Stylist or Salon"
                    {...register("expertis")}
                  />
                  <Button>
                    <Image
                      src={assest.search}
                      alt="img"
                      width={20}
                      height={20}
                      onClick={handleSubmit(submitData)}
                    />
                  </Button>
                </div>
                <div
                // style={{
                //   display: "flex",
                // }}
                >
                  {/* Technician  header */}
                  <Button
                    className={styles.beauti_btn}
                    onClick={technicianChange}
                  >
                    {switchingUserData === "Both"
                      ? "Switch"
                      : userDetails?.data?.user_type === "Both"
                        ? " Switch"
                        : "Switch"}
                  </Button>

                  <Button
                    className={styles.cart}
                    onClick={() => router.push("/chat")}
                  >
                    <Image src={assest.msg} alt="img" width={20} height={20} />
                  </Button>
                  <Button
                    className={styles.user_btn}
                    onClick={() => router.push("/service/account")}
                  >
                    {/* <Image
                      src={assest.userheadIcon}
                      alt="img"
                      width={50}
                      height={50}
                    /> */}
                    <img
                      src={
                        profileImageOriginal !== null
                          ? `${mediaPath}/uploads/user/business_image/${profileImageOriginal}`
                          : assest.noImage
                      }
                      width={105}
                      height={105}
                      onError={onErrorImg}
                    />
                  </Button>
                  <Button
                    className={styles.logout}
                    onClick={() => dispatch(handleLoggedout())}
                  >
                    <LogoutIcon sx={{ color: "white" }} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchHeader;
