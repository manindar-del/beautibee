import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React from "react";
import styles from "@/styles/service/addservice.module.scss";
import { Container } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ServiceForm from "@/components/serviceForm";
import { useRouter } from "next/router";
import { useGetExperience, useGetServiceCategory, useGetBadgeList, useGetAllCountry } from "@/hooks/useService";

function Edit() {
  
  const { data } = useGetExperience();
  const router = useRouter();
  const { data:serviceCategories } = useGetServiceCategory();
  const { data:badgeLists } = useGetBadgeList();
  const { data:countryList } = useGetAllCountry();
  


  return (
    <DashboardWrapper headerType="search" page="service">
      <Container>
        <div className={styles.jobs_wrapper}>
          <div className={styles.heading_top}>
            <h3
              className="headingH3 pointerBtn"
              onClick={() => router.push("/service/service")}
            >
              <KeyboardBackspaceIcon /> Services
            </h3>
          </div>
          <ServiceForm
            formType={"edit"}
            allExperienceList={data?.pages[0]?.data}
            allServiceCategories={serviceCategories?.pages[0]?.data}
            allBadgeList={badgeLists?.pages[0]?.data}
            allCountryList={countryList?.pages[0]?.data}
            
           
          />
        </div>
      </Container>
    </DashboardWrapper>
  );
}

export default Edit;
