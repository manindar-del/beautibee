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
import { useResetPassword } from "@/hooks/useForgetPassword";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Wrapper = dynamic(() => import("@/layout/Wrappers/Wrapper"));



const Index = () => {
  const cookie = new Cookies();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  let userDetailsWithOtp = cookie.get("userDetailId");
  console.log(userDetailsWithOtp,"userDetailsWithOtp")

  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  

  const validationSchema = Yup.object().shape({
    password: Yup.string()
    .required(error.newPassword)
    .matches(regexFormat.password, error.passwordFormat)
    .min(8, error.passwordLength),


    confirm_password: Yup.string()
      .required(error.confirmPassword)
      .matches(regexFormat.password, error.passwordFormat)
      .min(8, error.passwordLength),
  });

  

  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "all",
    defaultValues: { remember_me: null },
  };
  const { register, handleSubmit, formState, getValues, setValue } =
    useForm(formOptions);
  const { errors } = formState;

  /* A hook that is used to send a reset password email to the user. */
  const { mutate: resetPassword, status } = useResetPassword();
  


  

  /**
   * A function that is called when the user clicks the submit button on the reset password form.
   */
  const onSubmitReset = async (data) => {
    setIsLoading(true);
    resetPassword({
      ...data,
      user_id: userDetailsWithOtp?.data?._id
    
    
    });
  };

  useEffect(() => {
    if (status === "success") {
      setIsLoading(false);
    }
  }, [status]);

  return (
    <Wrapper headerType="login" hasFooter={false}>
      <div className={styles.login}>
        <div className="container">
          <div className={styles.login_main_wrapper}>
            <div className={styles.login_left_panel}>
              <div className={styles.left_side_wrapper}>
                <div className={styles.left_side_login}>
                  <div className={styles.left_side_login_wrapper}>
                    <h5>Reset Password</h5>

                    <div className={styles.login_form_wrapper}>
                      <div className={styles.login_input}>
                        <label> New Password</label>
                        <input
                           type={showPass ? "text" : "password"}
                          placeholder="Enter  Your New password"
                          {...register("password")}
                          name="password"
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
                        <label>Confirm Password</label>
                        <input
                          type={showPass ? "text" : "password"}
                          placeholder="Enter Your  Confirm Password"
                          {...register("confirm_password")}
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

                        {errors.confirm_password && (
                          <div className="text-danger d-flex">
                            <span style={{ marginLeft: "5px", color: "red" }}>
                              {" "}
                              {errors.confirm_password?.message}{" "}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className={styles.login_input}>
                        <button onClick={handleSubmit(onSubmitReset)}>
                          {isLoading ? "Loading..." : "Reset Password"}
                        </button>
                      </div>
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
