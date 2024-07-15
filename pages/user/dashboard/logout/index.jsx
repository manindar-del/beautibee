import * as React from "react";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/pages/feedback.module.scss";
import { handleLoggedout } from "@/reduxtoolkit/auth.slice";
import { useDispatch } from "react-redux";


const Logout = () => {
  const dispatch = useDispatch()


  return (
    <DashboardWrapper hasSidebar={true} headerType="search" page="user">
      <div className={styles.feedback_wrapper}>
        <h4>Logout & Delete account</h4>

        <div className={styles.feedback_full_wrapper}>
          <div className={styles.feedback_input}>
            <label>Are you sure you want to logging out?</label>
          </div>
          <div className={styles.feedback_input}>
            <button onClick={() => dispatch(handleLoggedout())}>Logout</button>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Logout;
