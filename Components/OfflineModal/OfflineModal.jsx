import * as React from "react";

import dynamic from "next/dynamic";
import offlineJson from "@/json/lottie/offline.json";
import { checkWindow } from "@/lib/functions/_storage.lib";
import { useDispatch, useSelector } from "react-redux";
import { setIssOnline } from "@/reduxtoolkit/global.slice";

// const Lottie = dynamic(() => import("react-lottie"));
const Button = dynamic(() => import("@mui/material/Button"));
const DialogContent = dynamic(() => import("@mui/material/DialogContent"));
const Stack = dynamic(() => import("@mui/material/Stack"));
const Dialog = dynamic(() => import("@mui/material/Dialog"));

export default function OfflineModal() {
  const dispatch = useDispatch();

  const { isOnline } = useSelector((s) => s.global);

  const handleClose = () => {
    dispatch(setIssOnline(false));
  };

  const handleRetry=()=> {
    if (checkWindow()) {
      window.location.reload();
    }
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOnline}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent dividers>
          {/* <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: offlineJson,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={300}
            width={300}
          /> */}
          <Stack direction="row" justifyContent="center">
            <h1>You are offline!</h1>
          </Stack>
          <Stack direction="row" justifyContent="center">
            <Button
              onClick={handleRetry}
              variant="contained"
              color="secondary"
              disableElevation
            >
              Retry
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}
