import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React from "react";
import styles from "@/styles/pages/blog.module.scss";

function index({ ratingValue }) { 

  return (
    
      <DashboardWrapper headerType="search">
        <div className={styles.feedback_wrapper}>
        <div className="container">
          <div className={styles.blog_sec}>
            <h4>Blog Us</h4>
            
          </div>
          </div>
        </div>
      </DashboardWrapper>
    
  );
}

export default index;
