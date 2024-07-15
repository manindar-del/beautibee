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
import Seo  from "../../Components/SEO/Seo";
import useUser from "@/hooks/useAutomaticLogout";

const PaymentHeader = ({ page }) => {
  const dispatch = useDispatch();

 // logoutUser
  const { isLoading } = useUser();

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


  const router = useRouter();
  const projectName = "BeautiBee";
const routerText = router.pathname.split("/");
routerText.shift();
const favText = capitalizeWords(routerText);




  const { getProfileData } = useSelector((store) => store.profile);
  const [profileImageOriginal, setProfileImageOriginal] = useState(null);

  useEffect(() => {
    if (getProfileData !== undefined) {
      setProfileImageOriginal(getProfileData?.profile_image);
    }
  }, [getProfileData]);

  useEffect(() => {
    if (getProfileData !== undefined) {
      setProfileImageOriginal(getProfileData?.business_image);
    }
  }, [getProfileData]);

  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };
  return (
    <div>
      <Seo
      title={router.pathname === "/"
        ? `${projectName}`
        : `${projectName} | ${favText}`}
      canonical=""
      description=""
      url=""
      image="" />
      {page === "user" ? (
        <>
          <div className={styles.dash_header}>
            <div className="container">
              <div className={styles.header_content}>
                <div className={styles.logo}>
                  {/* <img src="./assets/images/logo.svg" alt="" /> */}
                  <Image src={assest.logo} alt="img" width={100} height={100} />
                </div>

                <Button
                  className={styles.user_btn}
                  onClick={() => router.push("/user/dashboard/account")}
                >
                  <img
                    src={
                      profileImageOriginal !== null
                        ? `${mediaPath}/uploads/user/profile_pic/${profileImageOriginal}`
                        : assest.noImage
                    }
                    width={105}
                    height={105}
                    onError={onErrorImg}
                  />
                </Button>
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
                  {/* <img src="./assets/images/logo.svg" alt="" /> */}
                  <Image src={assest.logo} alt="img" width={100} height={100} />
                </div>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Button
                    className={styles.user_btn}
                    onClick={() => router.push("/service/account")}
                  >
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

export default PaymentHeader;
