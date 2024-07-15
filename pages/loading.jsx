import * as React from "react";
import dynamic from "next/dynamic";

const Grid = dynamic(() => import("@mui/material/Grid"));
const Box = dynamic(() => import("@mui/material/Box"));
const Skeleton = dynamic(() => import("@mui/material/Skeleton"));
const Wrapper = dynamic(() => import("@/layout/Wrappers/Wrapper"));

function Media() {
  return (
    <Wrapper>
      <Grid container wrap="nowrap">
        <Box sx={{ width: 210, marginRight: 0.5, my: 5 }}>
          <Skeleton variant="rectangular" width={210} height={118} />

          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="60%" />
          </Box>
        </Box>
      </Grid>
    </Wrapper>
  );
}

export default function Loading() {
  return (
    <Box sx={{ overflow: "hidden" }}>
      <Media loading />
    </Box>
  );
}
