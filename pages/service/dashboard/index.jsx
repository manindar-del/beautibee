import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/service/myaccountmain.module.scss";
import Image from "next/image";
import assets from "@/json/assest";
import { Box, Grid, Button } from "@mui/material";
import { useRouter } from "next/router";
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import assest from "@/json/assest";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { useGetAllOrderList } from "@/hooks/useOrder";

export async function getServerSideProps({ req }) {
  if (req?.cookies?.userDetails) {
    let userDetails = JSON.parse(req?.cookies?.userDetails);
    //console.log(userDetails,"user");
    
    if (
      userDetails?.data?.user_type === "Technician" ||
      userDetails?.data?.user_type === "Both" ||
      userDetails?.data?.user_type === "Customer" ||
      userDetails?.user_type === "Technician" 
     
    ) {
      if (userDetails?.data?.account_verified === true ||  userDetails?.account_verified === true) {
        return { props: {} };
      } else {
        return {
          redirect: {
            permanent: false,
            destination: "/service/account",
          },
        };
      }
    }
  } else {
    let userDetails = JSON.stringify(req?.cookies?.userDetails);
  }

  return { props: {} };
}

function Index() {
  const router = useRouter();
  const { getProfileData } = useSelector((store) => store.profile);
  const [profileImageOriginal, setProfileImageOriginal] = useState(null);
  const { data } = useGetAllOrderList();
  /* This is a react hook that is used to run a function when a component is mounted. */
  useEffect(() => {
    if (getProfileData !== undefined) {
      setProfileImageOriginal(getProfileData?.profile_image);
    }
  }, [getProfileData]);
  /* This is a react hook that is used to run a function when a component is mounted. */

  useEffect(() => {
    if (getProfileData !== undefined) {
      setProfileImageOriginal(getProfileData?.business_image);
    }
  }, [getProfileData]);

  /**
   * A function that is called when an image fails to load.
   */
  const onErrorImg = (ev) => {
    ev.target.src = assest.profile1;
  };

   //console.log(getProfileData.is_free_subscriber,"getProfileData");

  return (
    <DashboardWrapper headerType="search" page="service">
      <Container>
        <div className={styles.jobs_wrapper}>
          <h4
            style={{
              textAlign: "center",
              color: "red",
              display:
                getProfileData?.isSubscribed == false  || getProfileData?.is_free_subscriber == false ? "block" : "none",
            }}
          >
            "You have no active membership plan. To avail all the services,
            choose any plan from the membership tab"
          </h4>
          <div className={styles.jobs_full_wrapper}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item md={5} sm={6} xs={12}>
                  <div className={styles.profile_sec_box}>
                    <div className={styles.profile_sec}>
                      <div className={styles.profile_sec_left}>
                        {/* <Image src={assets.userimg} width={100} height={100} /> */}
                        <img
                          src={
                            profileImageOriginal !== null
                              ? `${mediaPath}/uploads/user/business_image/${profileImageOriginal}`
                              : assest.noImage
                          }
                          width={100}
                          height={100}
                          onError={onErrorImg}
                        />
                      </div>
                      <div className={styles.profile_sec_right}>
                        <h2>{getProfileData?.full_name}</h2>
                        {/* <h3>Last login : 2021-10-25 Monday</h3>
                        <p>www.Wellness.com</p> */}
                      </div>
                      <div
                        className={styles.edit_box}
                        onClick={() => router.push("/service/account")}
                      >
                        <p>Edit</p>
                      </div>
                    </div>
                    {getProfileData?.business_info !== "" && (
                      <div className={styles.bio}>
                        <h2>Business Info</h2>
                        <p>{getProfileData?.business_info}</p>
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item md={6} xs={12}>
                  <div className={`${styles.list_sec} ${styles.list_sec_main}`}>
                    <ul>
                      <li
                        style={{
                          cursor:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "not-allowed"
                              : "default",
                          background:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "#c5b6b64d"
                              : "#ffff",
                        }}
                      >
                        <Button
                          disabled={getProfileData?.isSubscribed == false}
                          onClick={() => router.push("/service/jobs")}
                        >
                          <Image src={assets.myicon7} width={26} height={24} />{" "}
                          <p>Recent Job Post</p>
                        </Button>
                      </li>
                      <li
                        style={{
                          cursor:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "not-allowed"
                              : "default",
                          background:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "#c5b6b64d"
                              : "#ffff",
                        }}
                      >
                        <Button
                          disabled={getProfileData?.isSubscribed == false}
                          onClick={() => router.push("/service/training")}
                        >
                          <Image src={assets.myicon1} width={26} height={24} />{" "}
                          <p>Training</p>
                        </Button>
                      </li>
                      <li
                        style={{
                          cursor:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "not-allowed"
                              : "default",
                          background:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "#c5b6b64d"
                              : "#ffff",
                        }}
                      >
                        <Button
                          disabled={getProfileData?.isSubscribed == false}
                          onClick={() => router.push("/service/product")}
                        >
                          <Image src={assets.myicon2} width={26} height={24} />{" "}
                          <p>Products</p>
                        </Button>
                      </li>
                      <li
                        style={{
                          cursor:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "not-allowed"
                              : "default",
                          background:
                            getProfileData?.isSubscribed == false  || getProfileData?.is_free_subscriber == false
                              ? "#c5b6b64d"
                              : "#ffff",
                        }}
                      >
                        <Button
                          disabled={getProfileData?.isSubscribed == false}
                          onClick={() => router.push("/service/service")}
                        >
                          <Image src={assets.myicon3} width={26} height={24} />{" "}
                          <p>Services</p>
                        </Button>
                      </li>
                      <li
                        style={{
                          cursor:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "not-allowed"
                              : "default",
                          background:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "#c5b6b64d"
                              : "#ffff",
                        }}
                      >
                        <Button
                          disabled={getProfileData?.isSubscribed == false}
                          onClick={() => router.push("/service/studio")}
                        >
                          <Image src={assets.myicon4} width={26} height={24} />{" "}
                          <p>Studio</p>
                        </Button>
                      </li>
                      <li
                        style={{
                          cursor:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "not-allowed"
                              : "default",
                          background:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "#c5b6b64d"
                              : "#ffff",
                        }}
                      >
                        <Button
                          disabled={getProfileData?.isSubscribed == false}
                          onClick={() => router.push("/service/reports")}
                        >
                          <Image src={assets.myicon5} width={26} height={24} />{" "}
                          <p>Report</p>
                        </Button>
                        {/* <span>2</span>  */}
                      </li>
                      <li
                        style={{
                          cursor:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "not-allowed"
                              : "default",
                          background:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "#c5b6b64d"
                              : "#ffff",
                        }}
                      >
                        <Button onClick={() => router.push("/service/order")}>
                          <Image src={assets.myicon6} width={26} height={24} />{" "}
                          <p>Orders</p>
                          <span>{data?.pages[0]?.data?.length}</span>
                        </Button>
                      </li>
                      <li onClick={() => router.push("/service/subscription")}>
                        <Image src={assets.myicon7} width={26} height={24} />{" "}
                        <p>Membership</p>
                      </li>{" "}
                      <li
                        style={{
                          cursor:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "not-allowed"
                              : "default",
                          background:
                            getProfileData?.isSubscribed == false || getProfileData?.is_free_subscriber == false
                              ? "#c5b6b64d"
                              : "#ffff",
                        }}
                      >
                        <Button
                          disabled={getProfileData?.isSubscribed == false}
                          onClick={() =>
                            router.push("/service/booking-history")
                          }
                        >
                          <Image src={assets.myicon3} width={26} height={24} />{" "}
                          <p>Booking history</p>
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </Container>
    </DashboardWrapper>
  );
}

export default Index;
