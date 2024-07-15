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
import { useForgetPassword } from "@/hooks/useForgetPassword";

import app from "config/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "@firebase/auth";

const Wrapper = dynamic(() => import("@/layout/Wrappers/Wrapper"));

const Index = () => {
  const cookie = new Cookies();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  

  const validationSchema = Yup.object().shape({
    email: Yup.string().required(error.email).email(error.emailFormat),
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
  const { mutate: forgetPassword, status, data:userDetails } = useForgetPassword();
  

  /**
   * A function that is called when the user clicks the submit button on the reset password form.
   */
  const onSubmitReset = async (data) => {
    setIsLoading(true);
    
    forgetPassword(data);
    
  };

  useEffect(() => {
    if (status === "success") {
      cookie.set("userDetailId", JSON.stringify(userDetails));
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
                    <h5>Forget Password Request</h5>

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
                        <button onClick={handleSubmit(onSubmitReset)}>
                          {isLoading ? "Loading..." : "Sent rest code"}
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
