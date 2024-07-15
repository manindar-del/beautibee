/* eslint-disable react/prop-types */
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import OfflineModal from "@/components/OfflineModal/OfflineModal";
import { useIsOnline } from "@/hooks/useIsOnline";

import LoginHeader from "../Headers/LoginHeader";
import PaymentHeader from "../Headers/PaymentHeader";
import { useDispatch } from "react-redux";
import useUser from "@/hooks/useAutomaticLogout";
import { Backdrop, CircularProgress } from "@mui/material";
//import { getProfileDetails } from "@/reduxtoolkit/profile.slice";

// import { Suspense } from "react";

// DYNAMIC IMPORT
const Header = dynamic(() => import("../Headers/Header"), {
  ssr: true,
});
const Footer = dynamic(() => import("../Footers/Footer"), {
  ssr: true,
});

const Wrapper = ({
  children,
  headerType = "normal",
  hasFooter = true,
  page = "user",
}) => {
  //const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(getProfileDetails());
  // }, []);
  useIsOnline();

  const { isLoading } = useUser();
  const [loader, setLoader] = useState(true);

  // useOnlineStatus();

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 500);
  }, []);

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
    <>
      {headerType === "normal" && <Header page={page} />}

      {headerType === "login" && <LoginHeader page={page} />}

      {headerType === "payment" && <PaymentHeader page={page} />}

      {children}

      {hasFooter && <Footer />}

      <OfflineModal />
    </>
  );
};

export default Wrapper;
