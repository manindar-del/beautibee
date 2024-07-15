/* eslint-disable react/prop-types */
import dynamic from "next/dynamic";
import NextNProgress from "nextjs-progressbar";
import OfflineModal from "@/components/OfflineModal/OfflineModal";
import { useEffect, useState } from "react";
import LoginHeader from "../Headers/LoginHeader";
import SearchHeader from "../Headers/SearchHeader";
import DashBoardSidebar from "../Sidebar/DashBoardSidebar";
import styles from "@/styles/layout/dashboardwrapper.module.scss";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import { getProfileDetails } from "@/reduxtoolkit/profile.slice";
import { useIsOnline } from "@/hooks/useIsOnline";
import useUser from "@/hooks/useAutomaticLogout";

// import { Suspense } from "react";

// DYNAMIC IMPORT
const DashboardHeader = dynamic(() => import("../Headers/DashboardHeader"), {
  ssr: true,
});
const Footer = dynamic(() => import("../Footers/Footer"), {
  ssr: true,
});

const DashboardWrapper = ({
  children,
  headerType = "normal",
  hasFooter = true,
  hasSidebar = false,
  page = "user",
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfileDetails());
  }, []);

  useIsOnline();

  const { isLoading } = useUser();
  const [loader, setLoader] = useState(true);

  // useOnlineStatus();

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 500);
  }, []);


  return (
    <>
      {headerType === "normal" && <DashboardHeader page={page} />}
      {headerType === "search" && <SearchHeader page={page} />}

      {hasSidebar ? (
        <div className={styles.pagewrapper}>
          <div className="container">
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} className={styles.itemsEnd}>
                <Grid item lg={3} xs={12}>
                  <DashBoardSidebar />
                </Grid>
                <Grid item lg={9} xs={12}>
                  {children}
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      ) : (
        children
      )}

      {hasFooter && <Footer />}
      <OfflineModal />
    </>
  );
};

export default DashboardWrapper;
