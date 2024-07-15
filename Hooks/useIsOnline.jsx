import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkWindow } from "@/lib/functions/_storage.lib";
import { setIssOnline } from "@/reduxtoolkit/global.slice";

/**
 * It returns a boolean value that indicates whether the user is online or not
 * @returns A boolean value that represents the online status of the user.
 */
export function useIsOnline() {
  const navigator = checkWindow() && window?.navigator;
  const [status, setStatus] = useState(navigator?.onLine);
  const dispatch = useDispatch();
  const handleChange = () => {
    setStatus(navigator?.onLine);
    dispatch(setIssOnline(!navigator?.onLine));
  };

  useEffect(() => {
    if (checkWindow()) {
      window.addEventListener("online", handleChange);
      window.addEventListener("offline", handleChange);
    }

    return () => {
      checkWindow() && window.removeEventListener("online", handleChange);
      checkWindow() && window.removeEventListener("offline", handleChange);
    };
  }, []);

  return status;
}
