import dynamic from "next/dynamic";
import styles from "@/styles/layout/_header.module.scss";
import Link from "next/link";
import assest from "@/json/assest";

import React from "react";
import Image from "next/image";
import Seo  from "@/components/SEO/Seo"
import { useRouter } from "next/router";


const RegisterForm = dynamic(() => import("@/components/registerForm"));

export async function getServerSideProps({ req }) {
  let has_token = req.cookies.token;
  if (has_token) {
    return {
      redirect: {
        destination: "/service/dashboard",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
  return { props: {} };
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
    <div className={styles.login_logo} style={{marginLeft:"30px"}}>
            <Link href="/">
              <Image src={assest.logo} width={160} height={90} />
            </Link>
          </div>
      <RegisterForm registerType="technician" />
    </>
  );
};

export default Index;
