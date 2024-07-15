import { ProfileDetailsQuery } from "@/api/functions/cms.api";
import { useMutation, useQuery } from "react-query";
import { parseCookies } from "nookies";
import { handleLoggedout, setLoginData } from "@/reduxtoolkit/auth.slice";
// import eventEmitter from "services/event.emitter";
// import events from "@/json/events/events";

import { socketInstance } from "@/lib/config/socket.config";
import { getProfileDetails } from "@/reduxtoolkit/profile.slice";
import { useDispatch, useSelector } from "react-redux";
import { Cookies } from "react-cookie";

const useUser = () => {
  const cookies = parseCookies();
  const token = cookies?.token;

  const dispatch = useDispatch();
  const cookie = new Cookies();

  let userDetails = cookie.get("userDetails");
  //console.log(userDetails?.data._id, "userDetailsssssssssssssss");

  const { userData, isloggedIn } = useSelector((s) => s.auth);
  console.log(isloggedIn, "isLoggedIn");

  const { isProfileLoading, getProfileData } = useSelector(
    (store) => store.profile
  );

  const socket = socketInstance;

  console.log(socket, "socket");

  //console.log(getProfileData,"getProfileData");

  //console.log(token,"token");

  const profileDetails = useQuery("userdetails", ProfileDetailsQuery, {
    enabled: !!token && getProfileData === null,
    onSuccess(data) {
      //console.log(data.data?.data, "datauser");
      if (
        // data?.status === 200 ||
        data?.data?.data?.isActive === false ||
        data?.data?.data?.isBlocked ||
        data?.data?.data?.isDeleted ||
        data?.data?.data?.isBanned === true
      ) {
        // if (
        //   data?.data?.isActive === false ||
        //   data?.data?.isBlocked ||
        //   data?.data?.isDeleted
        // ) {
        //   eventEmitter.emit(events.showNotification, {
        //     message: "Your Account is inactive",
        //     options: { variant: "warning" },
        //   });
        // }

        dispatch(handleLoggedout());
      } else {
        dispatch(setLoginData());
      }
    },
    onError() {
      dispatch(handleLoggedout());
    },
  });

  // const profileUpdateMutation = useMutation({
  //   mutationKey: "profileUpdate",
  //   mutationFn: ProfileUpdateMutation,
  // });

  socket.on("user-inactive", (data) => {
    console.log("Received", data);

    // Handle the received data here

    // if (typeof window !== 'undefined') {

    //   if(data.userStatus === false || data.isBanned === true || data.isDeleted === true){
    //     //console.log(data.userStatus,"false")
    //     dispatch(handleLoggedout())

    //   }

    // }

    if (typeof window !== "undefined") {
      if (
        (userDetails?.data?._id === data.userId && data.userStatus === false) ||
        data.isBanned === true ||
        data.isDeleted === true
      ) {
        dispatch(handleLoggedout());
      } else {
        dispatch(setLoginData());
      }
    }
  });

  return { ...profileDetails };
};

export default useUser;
