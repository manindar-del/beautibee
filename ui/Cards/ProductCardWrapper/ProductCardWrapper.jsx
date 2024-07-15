import React from "react";
import styles from "./ProductCardWrapper.module.scss";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";

const Card = dynamic(() => import("@mui/material/Card"));

const ProductCardWrapper = ({ children }) => {
  return (
    <div className={styles.ProductCardWrapper}>
      <Card elevation={0}>{children}</Card>
    </div>
  );
};

ProductCardWrapper.propTypes = {
  children: PropTypes.any,
};

export default ProductCardWrapper;
