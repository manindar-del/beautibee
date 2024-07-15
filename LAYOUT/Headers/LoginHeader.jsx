import assest from "@/json/assest";

import React from "react";
import styles from "@/styles/layout/_header.module.scss";
import Image from "next/image";
import { Button } from "@mui/material";
import MyButton from "@/ui/Buttons/MyButton/MyButton";
import Link from "next/link";
import { useRouter } from "next/router";
import Seo  from "../../Components/SEO/Seo"
import useUser from "@/hooks/useAutomaticLogout";






const LoginHeader = ({ page }) => {


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


  const router = useRouter();
  const projectName = "BeautiBee";
const routerText = router.pathname.split("/");
routerText.shift();
const favText = capitalizeWords(routerText);

// logoutUser
const { isLoading } = useUser();



  return (

    <><Seo
      title={router.pathname === "/"
        ? `${projectName}`
        : `${projectName} | ${favText}`}
      canonical=""
      description=""
      url=""
      image="" />
      <div className={styles.login_header}>
        <div className="container">
          <div className={styles.login_header_wrapper}>
            <div className={styles.login_logo}>
              <Link href="/">
                <Image src={assest.logo} width={160} height={90} />
              </Link>
            </div>

            {!page === "service" && (
              <div className={styles.login_button}>
                <MyButton onClick={() => router.push("/service")}>
                  Become a Beautibee{" "}
                </MyButton>
              </div>
            )}
          </div>
        </div>
      </div></>
  );
};

export default LoginHeader;
