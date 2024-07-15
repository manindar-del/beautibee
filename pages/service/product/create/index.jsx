import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React from "react";
import styles from "@/styles/service/addproduct.module.scss";
import { Container } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ProductForm from "@/components/productForm";
import { useRouter } from "next/router";
import { useGetCategoryProduct } from "@/hooks/useProducts";

function Index() {

  const { data } = useGetCategoryProduct();
  const router = useRouter();



  return (
    <DashboardWrapper headerType="search" page="service">
      <Container>
        <div className={styles.jobs_wrapper}>
          <div className={styles.heading_top}>
            <h3
              className="headingH3 pointerBtn"
              onClick={() => router.push("/service/product")}
            >
              <KeyboardBackspaceIcon /> Products
            </h3>
          </div>
          <ProductForm
           formType={"Create"}
           allCategoryProductList={data?.pages[0]?.data}
          
          />
        </div>
      </Container>
    </DashboardWrapper>
  );
}

export default Index;
