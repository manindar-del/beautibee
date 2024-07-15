import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Cookies } from "react-cookie";
// import { handleLoggedout } from "@/reduxtoolkit/auth.slice";
import assest from "@/json/assest";
// import Image from "next/image";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import styles from "@/styles/layout/_header.module.scss";
import styles2 from "@/styles/layout/dashboardheader.module.scss";
import { getProfileDetails } from "@/reduxtoolkit/profile.slice";

const AppBar = dynamic(() => import("@mui/material/AppBar"));
const Toolbar = dynamic(() => import("@mui/material/Toolbar"));
import { switchUserAccount } from "@/hooks/useProfile";
import Seo  from "../../Components/SEO/Seo";
import useUser from "@/hooks/useAutomaticLogout";
import { Backdrop, CircularProgress } from "@mui/material";


const ResponsiveAppBar = ({ page }) => {
  const dispatch = useDispatch();
  const { getProfileData } = useSelector((store) => store.profile);
  const router = useRouter();
  const cookie = new Cookies();
  const token = cookie.get("token");
  let userDetails = cookie.get("userDetails");
  const [loader, setLoader] = useState(true);

  const { data: switchingUser, mutate: ChangeUser } = switchUserAccount();

  const [open, setopen] = React.useState(false);
  const [profileImageOriginal, setProfileImageOriginal] = useState(null);
  const [profileImageOriginalTechnician, setProfileImageOriginalTechnician] = useState(null);

  
  
  useEffect(() => {
    if (getProfileData !== undefined) {
      setProfileImageOriginal(getProfileData?.profile_image);
    }
  }, [getProfileData]);


  useEffect(() => {
    if (getProfileData !== undefined) {
      setProfileImageOriginalTechnician(getProfileData?.business_image);
    }
  }, [getProfileData]);

  const onErrorImg = (ev) => {
    ev.target.src = assest.profile1;
  };

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

  const capitalizeWords = (str) => {
    if (typeof str === "string") {
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else if (Array.isArray(str)) {
      const capitalizedArray = str.map((word) => {
        return word
          .toLowerCase()
          .charAt(0)
          .toUpperCase() + word.slice(1);
      });
      return capitalizedArray.join(" ");
    }
  };

  const projectName = "BeautiBee";
  const routerText = router.pathname.split("/");
  routerText.shift();
  const favText = capitalizeWords(routerText);


  useEffect(()=>{
  dispatch(getProfileDetails())
  },[])


// logoutUser
  const { isLoading } = useUser();

  // if (loader || isLoading) {
  //   return (
  //     <Backdrop
  //       sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
  //       open
  //     >
  //       <CircularProgress sx={{ color: "var(--activeIconColor)" }} />
  //     </Backdrop>
  //   );
  // }



  return (

    <><Seo
      title={router.pathname === "/"
        ? `${projectName}`
        : `${projectName} | ${favText}`}
      canonical=""
      description=""
      url=""
      image="" />
      <div className={styles.pageHeader}>
        {page === "user" ? (
          <>
            <AppBar>
              <div className="container">
                <Toolbar disableGutters>
                  <div className={styles.header}>
                    <div className={styles.leftHeader}>
                      <div className={styles.headerLogo}>
                        <Link href="/">
                          <img src="./assets/images/logo.svg" alt="" />
                        </Link>
                      </div>
                      <div className={styles.humberger_menu}>
                        <Button onClick={() => setopen(true)}>
                          <MenuIcon />
                        </Button>
                        <Drawer
                          anchor={"right"}
                          open={open}
                          onClose={() => setopen(false)}
                        >
                          <Button onClick={() => setopen(false)}>
                            <CloseIcon />
                          </Button>
                          <ul className={styles.mobile_menu}>
                            <li>
                              <Link href="/">Home</Link>
                            </li>
                            <li>
                              <Link href="/about">About Us</Link>
                            </li>
                            <li>
                              <Link href="/user/blog">Blogs</Link>
                            </li>
                            <li>
                              <Link href="/search-provider">Service Listing</Link>
                            </li>
                            <li>
                              <Link href="/contact">Contact Us</Link>
                            </li>
                            <li>
                              {token?.length === null ||
                                (token === undefined && (
                                  <>
                                    {" "}
                                    <button
                                      className="btn btnBlack logbtn"
                                      onClick={() => router.push("/login")}
                                    >
                                      Log in
                                    </button>
                                  </>
                                ))}
                            </li>
                          </ul>
                        </Drawer>
                      </div>
                      <div className={styles.headerLink}>
                        <ul>
                          <li className={styles.active}>
                            <Link href="/">Home</Link>
                          </li>
                          <li>
                            <Link href="/about">About Us</Link>
                          </li>
                          <li>
                            <Link href="/user/blog">Blogs</Link>
                          </li>
                          <li>
                            <Link href="/search-provider">Service Listing</Link>
                          </li>
                          <li>
                            <Link href="/contact">Contact Us</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className={styles.headerRight}>
                      {/* Home Page Header */}
                      {token?.length === null || token === undefined ? (
                        <button
                          className="btn btnWhite"
                          onClick={() => router.push("/service")}
                        >
                          Become a Beautibee
                        </button>
                      ) : (
                        <button className="btn btnWhite" onClick={userchangable}>
                          {switchingUser?.data?.user_type === "Both"
                            ? "Switch"
                            : userDetails?.data?.user_type === "Both"
                              ? " Switch"
                              : "Become a Beautibee"}
                        </button>
                      )}

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
                            className={styles2.user_btn}
                            onClick={() => router.push("/user/dashboard/account")}
                          >
                            <img
                              src={profileImageOriginal !== null
                                ? `${mediaPath}/uploads/user/profile_pic/${profileImageOriginal}`
                                : assest.noImage}
                              width={50}
                              height={50}
                              onError={onErrorImg} />
                          </Button>
                        </>
                      )}

                      {/* <button className="btn btnBlack logbtn mb_login">
          <AccountCircleIcon />
        </button> */}
                    </div>
                  </div>
                </Toolbar>
              </div>
            </AppBar>
          </>
        ) : (
          <>
            <AppBar>
              <div className="container">
                <Toolbar disableGutters>
                  <div className={styles.header}>
                    <div className={styles.leftHeader}>
                      <div className={styles.headerLogo}>
                        <Link href="/">
                          <img src="./assets/images/logo.svg" alt="" />
                        </Link>
                      </div>
                    </div>
                    <div className={styles.headerRight}>
                      {token?.length === null || token === undefined ? (
                        <>
                          <button
                            className="btn btnBlack logbtn dsk_login"
                            onClick={() => router.push("/service/register")}
                          >
                            Join Now
                          </button>
                        </>
                      ) : (
                        <>
                          <Button
                            className={styles2.user_btn}
                            onClick={() => router.push("/service/account")}
                          >
                            <img
                              src={profileImageOriginal !== null
                                ? `${mediaPath}/uploads/user/business_image/${profileImageOriginalTechnician}`
                                : assest.noImage}
                              width={50}
                              height={50}
                              onError={onErrorImg} />
                          </Button>
                        </>
                      )}

                      {/* <button className="btn btnBlack logbtn mb_login">
          <AccountCircleIcon />
        </button> */}
                    </div>
                  </div>
                </Toolbar>
              </div>
            </AppBar>
          </>
        )}
      </div></>
  );
};
export default ResponsiveAppBar;
