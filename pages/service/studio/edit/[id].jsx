import React from "react";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/service/addstudio.module.scss";
import { Container } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import StudioForm from "@/components/studioForm";
import { useRouter } from "next/router";
import { useGetCategoryStudio, useGetAllCountry } from "@/hooks/useStudio";

function Index() {
  const { data } = useGetCategoryStudio();
  const router = useRouter();
  const {data:countryList} = useGetAllCountry();
  

  return (
    <DashboardWrapper headerType="search" page="service">
      <Container>
        <div className={styles.jobs_wrapper}>
          <div className={styles.heading_top}>
            <h3
              className="headingH3 pointerBtn"
              onClick={() => router.push("/service/studio")}
            >
              <KeyboardBackspaceIcon /> Studio
            </h3>
          </div>
          <StudioForm
          formType={"edit"}
          allStudioCategory={data?.pages[0]?.data}
          allCountryList={countryList?.pages[0]?.data}
          
          />
        </div>
      </Container>
    </DashboardWrapper>
  );
}

export default Index;
