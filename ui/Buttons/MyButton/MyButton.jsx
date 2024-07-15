import Button from "@mui/material/Button";
import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "@/styles/components/button.module.scss";

const MyButtonMemo = ({
  children,
  variant = "contained",
  disabled,
  disableElevation = false,
  onClick,
  color = "inherit",
  size = "medium",
  fullWidth = false,
  endIcon,
  startIcon,
  type = "button",
  loading = false,
}) => {
  return (
    <Button
      className={styles.button}
      variant={variant}
      disabled={disabled || loading}
      disableElevation={disableElevation}
      onClick={onClick}
      color={color}
      size={size}
      fullWidth={fullWidth}
      endIcon={endIcon}
      startIcon={startIcon}
      type={type}
    >
      {children}
    </Button>
  );
};
MyButtonMemo.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  disabled: PropTypes.string,
  disableElevation: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.string,
  fullWidth: PropTypes.string,
  type: PropTypes.string,
  endIcon: PropTypes.node,
  startIcon: PropTypes.node,
  loading: PropTypes.bool,
};

const MyButton = memo(MyButtonMemo);

export default MyButton;
