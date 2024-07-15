import dynamic from "next/dynamic";
import styles from "@/styles/layout/_header.module.scss";
import Link from "next/link";
import assest from "@/json/assest";
import { useRouter } from "next/router";

import React from "react";
import Image from "next/image";
import Seo  from "@/components/SEO/Seo"
const RegisterForm = dynamic(() => import("@/components/registerForm"));
export async function getServerSideProps({ req }) {
  // let has_token = req.cookies.get("token");

  if (req.cookies?.token?.length) {
    return {
      redirect: {
        destination: "/search-provider",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}






const Index = () => {

  const router = useRouter();
  const capitalizeWords = (str) => {
    if (typeof str === "string") {
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else if (Array.isArray(str)) {
      const capitalizedArray = str.map((word) => {
        return word
          .toLowerCase()
          .charAt(0)
          .toUpperCase() + word.slice(1);
      });
      return capitalizedArray.join(" ");
    }
  };
  
  const projectName = "BeautiBee";
  const routerText = router.pathname.split("/");
  routerText.shift();
  const favText = capitalizeWords(routerText);







  return (
    <>
    <Seo
      title={router.pathname === "/"
        ? `${projectName}`
        : `${projectName} | ${favText}`}
      canonical=""
      description=""
      url=""
      image="" />
      {/* <Wrapper headerType="login" hasFooter={false}>
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
                          <label>Full name</label>
                          <input type="text" placeholder="Enter full name" />
                        </div>

                        <div className={styles.login_input}>
                          <label>Email</label>
                          <input type="text" placeholder="yourmail@email.com" />
                        </div>

                        <div className={styles.login_input}>
                          <label>Password</label>
                          <input type="text" placeholder="Password" />
                        </div>

                        <div className={styles.login_input}>
                          <button>Create My Account</button>
                        </div>
                      </div>

                      <div className={styles.line_sec}>
                        <span>or Login With Email</span>
                      </div>

                      <Button className={styles.google_btn}>
                        <Image
                          src={assest.google}
                          alt="img"
                          width={24}
                          height={24}
                        />{" "}
                        Continue with Google
                      </Button>
                      <Button className={styles.google_btn}>
                        <Image
                          src={assest.fb}
                          alt="img"
                          width={24}
                          height={24}
                        />{" "}
                        Continue with Facebook
                      </Button>

                      <div className={styles.login_form_wrapper}>
                        <p>
                          Already have an account? <Link href="">Login</Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.login_footer}>
                    <p>© Copyright 2022 Beautibee | All Rights Reserved.</p>
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
      </Wrapper> */}
     
      <div className={styles.login_logo} style={{marginLeft:"30px"}}>
            <Link href="/">
              <Image src={assest.logo} width={160} height={90} />
            </Link>
          </div>
      <RegisterForm registerType="customer" />
    </>
  );
};

export default Index;
