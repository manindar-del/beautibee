import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import Image from "next/image";
import assest from "@/json/assest";
import styles from "@/styles/pages/login.module.scss";
import Button from "@mui/material/Button";
import { error } from "@/json/customSms/cumtomSms";
import { regexFormat } from "@/json/regex/regexFormat";

import { notiStackType } from "@/json/notiJson/notiJson";
import { useSnackbar } from "notistack";

import { SignUpUser, SocialLoginUser } from "@/api/functions/auth";
import { useRouter } from "next/router";
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



const Index = ({ registerType }) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const cookie = new Cookies();
  const [showPass, setShowPass] = useState(false);

  /* The above code is using Yup to validate the form fields. */
  const validationSchema = Yup.object().shape({
    full_name: Yup.string()
      .required(error.fullName)
      .matches(regexFormat.name, error.fullNameFormat)
      .max(15, "Please enter a firstname that is at least 15 characters"),
    email: Yup.string().required(error.email).email(error.emailFormat),
    password: Yup.string()
      .required(error.password)
      .matches(regexFormat.password, error.passwordFormat)
      .min(8, error.passwordLength),
  });

  const formOptions = { resolver: yupResolver(validationSchema), mode: "all" };
  const { register, handleSubmit, formState, getValues } = useForm(formOptions);
  const { errors } = formState;

  /**
   * A function that is called when the user clicks the submit button on the register page.
   */
  const onSubmitRegister = async (data) => {
    setIsLoading(true);
    const userFormData = {
      ...data,
      role: registerType,
    };
    let res = await SignUpUser(userFormData);
    if (res?.status === 200) {
      router.push("/login");
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

        let res = await SocialLoginUser({
          role: registerType,
          first_name: result?._tokenResponse?.firstName,
          last_name: result?._tokenResponse?.lastName,
          email:
            user?.email !== null ? user?.email : user?.providerData[0]?.email,
          social_id: user?.providerData[0].uid,
          register_type: "Google",
          deviceType: "web",
        });
        // console.log(res, "res");
        if (res?.status === 200) {
          cookie.set("token", res?.data?.token);
          cookie.set("userDetails", JSON.stringify(res?.data));

          if (res?.data?.data?.user_type === "Customer") {
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
   * It's a function that handles the login with Facebook
   */
  const handleFBLogin = (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const fbProvier = new FacebookAuthProvider();
    signInWithPopup(auth, fbProvier)
      .then(async (result) => {
        const user = result.user;

        let res = await SocialLoginUser({
          role: registerType,
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

          if (res?.data?.data?.user_type === "Customer") {
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
          //  router.push("/search-provider");
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
    <Wrapper headerType={registerType} hasFooter={false} page={registerType}>
      <div className={styles.login}>
        <div className="container">
          <div className={styles.login_main_wrapper}>
            <div className={styles.login_left_panel}>
              <div className={styles.left_side_wrapper}>
                <div className={styles.left_side_login}>
                  <div className={styles.left_side_login_wrapper}>
                    <h5>Register</h5>
                    <div className={styles.login_form_wrapper}>
                      <div className={styles.login_input}>
                        <label>Enter Full name</label>
                        <input
                          type="text"
                          placeholder="Enter Full Name"
                          {...register("full_name")}
                          name="full_name"
                        />
                        {errors.full_name && (
                          <div className="text-danger d-flex">
                            <span style={{ marginLeft: "5px", color: "red" }}>
                              {" "}
                              {errors.full_name?.message}{" "}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={styles.login_input}>
                        <label>Email</label>
                        <input
                          type="email"
                          placeholder="Email Address"
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
                          placeholder="Password"
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
                        <button onClick={handleSubmit(onSubmitRegister)}>
                          {isLoading ? "Loading..." : "Create My Account"}
                        </button>
                      </div>
                    </div>

                    <div className={styles.line_sec}>
                      <span>or Login With Email</span>
                    </div>

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

                    <div className={styles.login_form_wrapper}>
                      <p>
                        Already have an account?{" "}
                        <Link href="/login">Login</Link>
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
                    src={assest.registerImg}
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
