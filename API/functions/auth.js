import { auth_end_point } from "../Endpoints/apiEndPoints";
import axiosInstance from "axiosInstance";
export function SignUpUser(payload) {
  let _res = axiosInstance
    .post(auth_end_point.signUpUser, payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}

export function LoginUser(payload) {
  let _res = axiosInstance
    .post(auth_end_point.signInUser, payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}

export function SocialLoginUser(payload) {
  let _res = axiosInstance
    .post(auth_end_point.signInUserWithSocial, payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}
