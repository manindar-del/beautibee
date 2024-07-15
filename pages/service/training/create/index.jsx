import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/service/addtraining.module.scss";
import { Container } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import TrainingForm from "@/components/trainingForm";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();

  return (
    <DashboardWrapper headerType="search" page="service">
      <Container>
        <div className={styles.jobs_wrapper}>
          <div className={styles.heading_top}>
            <h3
              className="headingH3 pointerBtn"
              onClick={() => router.push("/service/training")}
            >
              <KeyboardBackspaceIcon /> Training
            </h3>
          </div>
          <TrainingForm 
           formType={"Create"}
          />
        </div>
      </Container>
    </DashboardWrapper>
  );
}

export default Index;
