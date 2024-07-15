import Image from "next/image";
import React, { useState, useEffect } from "react";
import styles from "@/styles/layout/dashboardheader.module.scss";
import assest from "@/json/assest";
import Link from "next/link";
import { Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { useSelector } from "react-redux";
import { Cookies } from "react-cookie";
import { switchUserAccount } from "@/hooks/useProfile";
import Seo from "@/components/SEO/Seo";
import { useIsOnline } from "@/hooks/useIsOnline";
import useUser from "@/hooks/useAutomaticLogout";

const DashboardHeader = () => {
  const router = useRouter();
  const cookie = new Cookies();
  const token = cookie.get("token");
  const { getProfileData } = useSelector((store) => store.profile);
  let userDetails = cookie.get("userDetails");

  const { data: switchingUser, mutate: ChangeUser } = switchUserAccount();

  // Change user-type get data from cookie set in api call
  let switchingUserData = cookie.get("userchnagess");

  const [open, setopen] = useState(false);
  const [profileImageOriginal, setProfileImageOriginal] = useState(null);

  useEffect(() => {
    if (getProfileData !== undefined) {
      setProfileImageOriginal(getProfileData?.profile_image);
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
        return word.toLowerCase().charAt(0).toUpperCase() + word.slice(1);
      });
      return capitalizedArray.join(" ");
    }
  };

  const projectName = "BeautiBee";
  const routerText = router.pathname.split("/");
  routerText.shift();
  const favText = capitalizeWords(routerText);


  useIsOnline();
// logoutUser
  const { isLoading } = useUser();
  const [loader, setLoader] = useState(true);

  // useOnlineStatus();

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 500);
  }, []);


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

      <div className={styles.dash_header}>
        <div className="container">
          <div className={styles.header_content}>
            <div className={styles.logo}>
              <Link href="/">
                {/* <img src="./assets/images/logo.svg" alt="" /> */}
                <Image src={assest.logo} alt="img" width={100} height={100} />
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
              </ul>
            </div>
            {/* <Button
              className={styles.beauti_btn}
              onClick={() => router.push("/service/register")}
            >
              Become a Beautibee
            </Button> */}

            {token?.length === null || token === undefined ? (
              <>
                {" "}
                <button
                  className="btn btnBlack logbtn dsk_login"
                  onClick={() => router.push("/login")}
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                {/* user search-provider Page Header */}
                <Button className={styles.beauti_btn} onClick={userchangable}>
                  {switchingUserData === "Both"
                    ? "Switch"
                    : userDetails?.data?.user_type === "Both"
                    ? " Switch"
                    : "Become a Beautibee"}
                </Button>
                <div style={{ display: "flex" }}>
                  <Button
                    className={styles.cart}
                    onClick={() => router.push("/user/cart")}
                  >
                    <Image src={assest.cart} alt="img" width={20} height={20} />
                  </Button>
                  <Button
                    className={styles.cart}
                    onClick={() => router.push("/chat")}
                  >
                    <Image src={assest.msg} alt="img" width={20} height={20} />
                  </Button>
                  <Button
                    className={styles.user_btn}
                    onClick={() => router.push("/user/dashboard/account")}
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
                          ? `${mediaPath}/uploads/user/profile_pic/${profileImageOriginal}`
                          : assest.noImage
                      }
                      width={50}
                      height={50}
                      onError={onErrorImg}
                    />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
