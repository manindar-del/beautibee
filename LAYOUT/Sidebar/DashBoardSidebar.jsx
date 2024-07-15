import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "@/styles/layout/_sidebar.module.scss";

const ProfileLinks = [
  {
    name: "My Account",
    route: "/user/dashboard/account",
  },

  {
    name: "Order",
    route: "/user/dashboard/order",
  },
  {
    name: "Appointment",
    route: "/user/dashboard/appointments",
  },
  {
    name: "Studio Rental",
    route: "/user/dashboard/studio",
  },

  {
    name: "Service Provider",
    route: "/user/dashboard/serviceprovider",
  },
  {
    name: "Feedback & Rating",
    route: "/user/dashboard/feedback",
  },
  {
    name: "Find Jobs",
    route: "/user/dashboard/jobs",
  },

  {
    name: "FAQ",
    route: "/user/dashboard/faq",
  },
  {
    name: "Logout",
    route: "/user/dashboard/logout",
  },
];

function DashBoardSidebar() {
  const router = useRouter();
  return (
    <div className={styles.leftSideBar}>
      <ul>
        {ProfileLinks?.map((item, index) => (
          <li
            className={router.pathname === item?.route ? styles.active : ""}
            key={index}
          >
            <Link href={item?.route}>{item?.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashBoardSidebar;
