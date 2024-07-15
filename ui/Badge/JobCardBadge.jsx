import { Box } from "@mui/material";
import React from "react";
import colors from "@/styles/abstracts/_variable.module.scss";

const JobCardBadge = ({
  color = colors.badge_color,
  background = colors.badge_background,
  text,
}) => {
  return (
    <Box
      sx={{
        color: color,
        background: background,
        // fontSize: "15px",
      }}
    >
      {text}
    </Box>
  );
};

export default JobCardBadge;
