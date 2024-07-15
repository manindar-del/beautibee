import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "@/styles/service/subscription.module.scss";
import Link from "next/link";
import {
  GetSubscriptionPlan,
  useCreateSubscription,
  useSwitchPlan,
  useCancelSubscription,
  useNewSubscription,
} from "@/hooks/useSubscription";
import { useSnackbar } from "notistack";
import  CreditCardForm  from "@/components/SubscriptionPaymentOption";
import CloseIcon from "@mui/icons-material/Close";
import { useProfileDetails } from "@/hooks/useProfile";
import { queryClient } from "pages/_app";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const index = () => {
  const { data: userDetails, mutate: userSubscriptionDetails } =
    useProfileDetails();

    console.log(userDetails,"userDetails");
  const router = useRouter();
  // List Of Subscription paln
  const { data: subscriptionPlan, refetch } = GetSubscriptionPlan();
  const [continues, setContinues] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(false);

  // switch plan
  const {
    mutate: switchPlan,
    data,
    status,
    isSuccess: successfulAddSubscription,
  } = useSwitchPlan();


  
  // Free Plan
  const {
    mutate: switchFreePlan,
    status: successfulAddFreeSubscription,
  } = useNewSubscription();

  const stripePromise = loadStripe('pk_test_51NC8juH8DTESxykdMLuQqFAyDY7Zr6bynV7U961EXoD0cufh8oiv3qb8mppMMixOe2dibNEIjBfpNgwqzpICEeg800YKxDHyj6');

  


  const handleClick = (id) => {
    setContinues(id);
  };

  // Cancel plan
  const {
    mutate: cancelPlan,
    status: cancelStatus,
    isSuccess: successfulCancelSubscription,
  } = useCancelSubscription();

  const cancelSubs = () => {
    cancelPlan();
  };

  // const HandleSwitchPlan = () => {
  //   switchPlan(data, {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["useProfileDetails"] });
  //       userSubscriptionDetails()
  //     },
  //   });
  // };

  // add new plan
  const {
    mutate: createSubscription,
    data:subscriptionDetails,
    isSuccess,
    isLoading,
    status: createSubscriptionStatus,
    isError,
  } = useCreateSubscription();

  const paymentCardOpen = (id, price) => {
    let data = {
      plan_id: id,
      total_price: price,
    };

    let dataFree = {
      plan_id: id,
      total_price: price,
      platform: "web",
    };
    if(price === 0)
    {
      switchFreePlan(dataFree);
    } else{
    setPaymentDetails(data);
    setOpenModal(true);
    }
   
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     setOpenModal(false);
  //   } else if (successfulAddSubscription) {
  //     setOpenModal(false);
  //   }
  // }, [isSuccess, successfulAddSubscription]);

  useEffect(() => {
    userSubscriptionDetails();
  }, []);

  useEffect(() => {
    if (
      status === "success" ||
      cancelStatus === "success" ||
      createSubscriptionStatus === "success" ||
      successfulAddFreeSubscription ==="success"
    ) {
      userSubscriptionDetails();
      refetch();
    }
  }, [status, cancelStatus, createSubscriptionStatus, successfulAddFreeSubscription]);

  // useEffect(() => {
  //   if (createSubscriptionStatus) {
  //     userSubscriptionDetails();

  //   }
  // }, [createSubscriptionStatus]);



  useEffect(()=>{
    if(paymentDetails){
  
      const data = {
        amount: paymentDetails?.total_price,
        plan_id: paymentDetails?.plan_id,
        currency:"usd",
        platform: "web",
      };
      if (userDetails?.data?.subscription_info) {
        switchPlan(data, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["useProfileDetails"] });
        },
      });
    } else {
      createSubscription(data);
    }
    userSubscriptionDetails();
    }
  },[paymentDetails])


  

  
  const clientSecret = subscriptionDetails?.data?.clientSecret;

  
    const appearance = {
      theme: "night",
    };
    
    const options = {
      clientSecret,
      appearance,
    };
    





  return (
    <DashboardWrapper headerType="search" page="service">
      <Container>
        <Box className={styles.subscriptionWrapper}>
          <div className={styles.heading_sec}>
            <h3
              className="headingH3 pointerBtn"
              onClick={() => router.push("/service/dashboard")}
            >
              <KeyboardBackspaceIcon /> Dashboard
            </h3>
          </div>
          <h2>Membership Plan</h2>
          <Grid container spacing={2}>
            {subscriptionPlan?.pages[0]?.data?.map((item) => {
              console.log(item,"itemddd");
              return (
                <Grid item xs={4}>
                  <Box className={styles.subscriptionBox}>
                    <>
                      <h4>{item?.name} </h4>
                      <h2>
                        ${item?.price} <span>/ {item?.frequency}</span>
                      </h2>

                      <div
                        dangerouslySetInnerHTML={{
                          __html: item?.description,
                        }}
                      ></div>
                       
                      {userDetails?.data?.subscription_info?.plan_id ===
                      item?.stripe_plan_id  ? (
                        <Button onClick={() => cancelSubs()}>Cancel</Button>
                      ) : null}

                      <Button
                        disabled={
                          userDetails?.data?.subscription_info?.plan_id ===
                          item?.stripe_plan_id 
                        }
                        onClick={() => handleClick(item?._id)}
                      >
                        {/* Select Plan */}
                        {userDetails?.data?.subscription_info?.plan_id ===
                        item?.stripe_plan_id 
                          ? "Active Plan"
                          : "Select Plan"}
                      </Button>
                      {continues === item?._id && (
                        <Button
                          disabled={
                            userDetails?.data?.subscription_info?.plan_id ===
                            item?.stripe_plan_id
                              ? "true"
                              : ""
                          }
                          style={{
                            display:
                              userDetails?.data?.subscription_info?.plan_id ===
                              item?.stripe_plan_id
                                ? "none"
                                : "block",
                          }}
                          className={
                            userDetails?.data?.subscription_info?.plan_id ===
                            item?.stripe_plan_id
                              ? styles.disabled
                              : styles.button_subs
                          }
                          onClick={() => {
                            paymentCardOpen(item?._id, item?.price);
                          }}
                        >
                          Continue
                        </Button>
                      )}
                      {/* <Link href="">Learn More</Link> */}
                    </>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Dialog
          open={openModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="checkout_modal"
          scroll={"body"}
        >
          <div className={styles.cross_sign}>
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
            <CreditCardForm
              // plan_id={paymentDetails?.plan_id}
              // total_price={paymentDetails?.total_price}
              isLoading={isLoading}
              // createSubscription={createSubscription}
              // switchPlan={switchPlan}
              userSubscriptionDetails={userSubscriptionDetails}
              userDetailsInfo={userDetails?.data?.subscription_info}
              setOpenModal={setOpenModal}
              clientSecret={clientSecret}
            />
             </Elements>
          )}
            <IconButton
              color="primary"
              onClick={() => {
                setOpenModal(false);
              }}
              className={styles.closeicon}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </div>
        </Dialog>
      </Container>
    </DashboardWrapper>
  );
};

export default index;
