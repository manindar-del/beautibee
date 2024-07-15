import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCookie } from "cookies-next";
import { checkLogin } from "@/reduxtoolkit/profile.slice";

/**
 * It checks if the user has a token, and if so, it dispatches an action to the reducer to set the user
 * as logged in
 * @returns A boolean value.
 */
export function useCheckAuth() {
  const dispatch = useDispatch();
  const hasToken = getCookie(process.env.NEXT_APP_TOKEN_NAME);

  useEffect(() => {
    const _val = hasToken?.length;
    dispatch(checkLogin(_val));
    return () => {
      dispatch(checkLogin(_val));
    };
  }, []);

  return hasToken;
}
