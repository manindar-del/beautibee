import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import Image from "next/image";
import assest from "@/json/assest";
import styles from "@/styles/pages/login.module.scss";
import Button from "@mui/material/Button";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { error } from "@/json/customSms/cumtomSms";
import { regexFormat } from "@/json/regex/regexFormat";

import { useRouter } from "next/router";

import { LoginUser, SocialLoginUser } from "@/api/functions/auth";
import { useSnackbar } from "notistack";
import { notiStackType } from "@/json/notiJson/notiJson";
import { Cookies } from "react-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import app from "config/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "@firebase/auth";

const Wrapper = dynamic(() => import("@/layout/Wrappers/Wrapper"));
export async function getServerSideProps({ req }) {
  // console.log(req,"req");
  let has_token = req.cookies.token;

  if (req.cookies?.token?.length) {
    return {
      redirect: {
        destination: "/service/dashboard",
        permanent: false,
      },
    };
  }

  if (req.cookies?.token?.length) {
    if (req.cookies?.userDetails?.data?.user_type === "Customer") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/service/dashboard",
          permanent: false,
        },
      };
    }
  }
  return {
    props: {},
  };
}
const Index = () => {
  const cookie = new Cookies();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  let userLoginDetail = cookie.get("userLoginDetails");
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  /* The above code is using Yup to validate the email and password fields. */
  const validationSchema = Yup.object().shape({
    email: Yup.string().required(error.email).email(error.emailFormat),
    password: Yup.string()
      .required(error.password)
      .matches(regexFormat.password, error.passwordFormat)
      .min(8, error.passwordLength),
  });

  /* *|MARKER_CURSOR|* */
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "all",
    defaultValues: { remember_me: null },
  };
  const { register, handleSubmit, formState, getValues, setValue } =
    useForm(formOptions);
  const { errors } = formState;

  /* *|MARKER_CURSOR|* */
  useEffect(() => {
    if (userLoginDetail?.remember_me === true) {
      setValue(
        "email",
        getValues("email") !== undefined
          ? getValues("email")
          : userLoginDetail?.email
      );
      setValue(
        "password",
        getValues("password") !== undefined
          ? getValues("password")
          : userLoginDetail?.password
      );
      setValue(
        "remember_me",
        getValues("remember_me") !== null
          ? getValues("remember_me")
          : userLoginDetail?.remember_me
      );
    }
  }, []);
  /**
   * It takes in the data from the form, sends it to the backend, and if the response is successful, it
   * sets the token and user details in the cookie and redirects the user to the appropriate page
   */
  const onSubmitLogin = async (data) => {
    setIsLoading(true);
    let res = await LoginUser(data);
    //console.log(res,"res");
    if (res?.status === 200) {
      cookie.remove("userDetailId");

      cookie.set("token", res?.data?.token);
      cookie.set("userDetails", JSON.stringify(res?.data));
      cookie.set("userLoginDetails", JSON.stringify(data));
      if (res?.data?.data?.user_type === "Customer") {
        router.push("/search-provider");
      } else if (res?.data?.data?.user_type === "Both") {
        router.push("/search-provider");
      } else if (res?.data?.data?.user_type === "Technician") {
        if (
          res?.data?.data?.account_verified === true &&
          res?.data?.data?.isSignupCompleted === true
        ) {
          router.push("/service/dashboard");
        } else {
          router.push("/service/account");
        }
      }
      enqueueSnackbar(res?.data?.message, notiStackType.success);
      setIsLoading(false);
    } else {
      enqueueSnackbar(res?.response?.data?.message, notiStackType.error);
      setIsLoading(false);
    }
  };

  /**
   * It's a function that handles the google login
   */
  const handleGoogleLogin = (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const gmailProvier = new GoogleAuthProvider();
    signInWithPopup(auth, gmailProvier)
      .then(async (result) => {
        const user = result.user;
        //console.log(result,"result");

        let res = await SocialLoginUser({
          first_name: result?._tokenResponse?.firstName,
          last_name: result?._tokenResponse?.lastName,
          email:
            user?.email !== null ? user?.email : user?.providerData[0]?.email,
          social_id: user?.providerData[0].uid,
          //profileImage: result?._tokenResponse?.photoUrl,

          register_type: "Google",
          deviceType: "web",
        });

        if (res?.status === 200) {
          cookie.set("token", res?.data?.token);
          cookie.set("userDetails", JSON.stringify(res?.data));

          if (
            res?.data?.data?.user_type === "Customer" ||
            res?.data?.data?.user_type === "Both"
          ) {
            router.push("/search-provider");
          } else if (res?.data?.data?.user_type === "Technician") {
            if (
              res?.data?.data?.account_verified === true &&
              res?.data?.data?.isSignupCompleted === true
            ) {
              router.push("/service/dashboard");
            } else {
              router.push("/service/account");
            }
          }

          // if (res?.data?.userRole?.role === "customer") {
          //   router.push("/search-provider");
          // } else {
          //   router.push("/service/dashboard");
          // }
          enqueueSnackbar(res?.data?.message, notiStackType.success);
          setIsLoading(false);
        } else {
          enqueueSnackbar(res?.response?.data?.message, notiStackType.error);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        if (errorCode === "auth/account-exists-with-different-credential") {
          enqueueSnackbar(
            "You have already registered with this email",
            notiStackType.error
          );
        }
        // if (errorCode === "auth/popup-closed-by-user") {
        //   toast.error("You have already registered with this email");
        // }
        console.log("error in google sign in ", error);
        // ...
      });
  };

  /**
   * It takes an event as an argument, prevents the default action, gets the authentication from the
   * firebase app, creates a new FacebookAuthProvider, and then signs in with a popup
   */
  const handleFBLogin = (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const fbProvier = new FacebookAuthProvider();
    signInWithPopup(auth, fbProvier)
      .then(async (result) => {
        const user = result.user;

        let res = await SocialLoginUser({
          first_name: result?._tokenResponse?.firstName,
          last_name: result?._tokenResponse?.lastName,
          email:
            user?.email !== null ? user?.email : user?.providerData[0]?.email,
          social_id: user?.providerData[0].uid,
          register_type: "Facebook",
          deviceType: "web",
        });
        if (res?.status === 200) {
          cookie.set("token", res?.data?.token);
          cookie.set("userDetails", JSON.stringify(res?.data));

          if (
            res?.data?.data?.user_type === "Customer" ||
            res?.data?.data?.user_type === "Both"
          ) {
            router.push("/search-provider");
          } else if (res?.data?.data?.user_type === "Technician") {
            if (
              res?.data?.data?.account_verified === true &&
              res?.data?.data?.isSignupCompleted === true
            ) {
              router.push("/service/dashboard");
            } else {
              router.push("/service/account");
            }
          }

          // if (res?.data?.userRole?.role === "customer") {
          //   router.push("/search-provider");
          // } else {
          //   router.push("/service/dashboard");
          // }
          enqueueSnackbar(res?.data?.message, notiStackType.success);
          setIsLoading(false);
        } else {
          enqueueSnackbar(res?.response?.data?.message, notiStackType.error);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        if (errorCode === "auth/account-exists-with-different-credential") {
          enqueueSnackbar(
            "You have already registered with this email",
            notiStackType.error
          );
        }
        // if (errorCode === "auth/popup-closed-by-user") {
        //   toast.error("You have already registered with this email");
        // }
        console.log("error in google sign in ", error);
        // ...
      });
  };

  return (
    <Wrapper headerType="login" hasFooter={false}>
      <div className={styles.login}>
        <div className="container">
          <div className={styles.login_main_wrapper}>
            <div className={styles.login_left_panel}>
              <div className={styles.left_side_wrapper}>
                <div className={styles.left_side_login}>
                  <div className={styles.left_side_login_wrapper}>
                    <h5>Welcome</h5>
                    <Button
                      className={styles.google_btn}
                      onClick={handleGoogleLogin}
                    >
                      <Image
                        src={assest.google}
                        alt="img"
                        width={24}
                        height={24}
                      />{" "}
                      Continue with Google
                    </Button>
                    <Button
                      className={styles.google_btn}
                      onClick={handleFBLogin}
                    >
                      <Image src={assest.fb} alt="img" width={24} height={24} />{" "}
                      Continue with Facebook
                    </Button>
                    <div className={styles.line_sec}>
                      <span>or Login With Email</span>
                    </div>

                    <div className={styles.login_form_wrapper}>
                      <div className={styles.login_input}>
                        <label>Email</label>
                        <input
                          type="email"
                          placeholder="Enter Your Email"
                          {...register("email")}
                          name="email"
                        />
                        {errors.email && (
                          <div className="text-danger d-flex">
                            <span style={{ marginLeft: "5px", color: "red" }}>
                              {" "}
                              {errors.email?.message}{" "}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={styles.login_input}>
                        <label>Password</label>
                        <input
                          type={showPass ? "text" : "password"}
                          placeholder="Enter Your Password"
                          {...register("password")}
                        />
                        <span
                          className={styles.open_eye}
                          onClick={() => setShowPass(!showPass)}
                        >
                          {showPass ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </span>
                        {errors.password && (
                          <div className="text-danger d-flex">
                            <span style={{ marginLeft: "5px", color: "red" }}>
                              {" "}
                              {errors.password?.message}{" "}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={styles.login_input}>
                        <div className={styles.login_input_checkbox}>
                          <div className={styles.login_checkbox}>
                            <div className={styles.checkbox}>
                              <input
                                type="checkbox"
                                {...register("remember_me")}
                              />
                              <span>Remember me</span>
                            </div>
                          </div>

                          <Link href="/forgetPasswordRequest">
                            forgot password?
                          </Link>
                        </div>
                      </div>

                      <div className={styles.login_input}>
                        <button onClick={handleSubmit(onSubmitLogin)}>
                          {isLoading ? "Loading..." : "Login"}
                        </button>
                      </div>

                      <p>
                        Not registered yet?{" "}
                        <Link href="/user/register">Create an Account</Link>
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.login_footer}>
                  <p>© Copyright 2023 Beautibee | All Rights Reserved.</p>
                </div>
              </div>
            </div>

            <div className={styles.login_right_panel}>
              <div className={styles.right_side_login}>
                <figure>
                  <Image
                    src={assest.loginImg}
                    alt="img"
                    width={100}
                    height={100}
                    layout="responsive"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>

        <Image
          src={assest.loginYellowRounded}
          width={100}
          height={100}
          className={styles.yellow_round}
        />
      </div>
    </Wrapper>
  );
};

export default Index;
