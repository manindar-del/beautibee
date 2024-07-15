import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/faq.module.scss";
import Image from "next/image";
import assets from "@/json/assest";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { faq_show } from "../../../../ReduxToolkit/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";

function index() {
  const dispatch = useDispatch();

  const { faq_list } = useSelector((state) => state?.dashbord);
 // console.log(faq_list, "faq_list");

  const [value, setValue] = React.useState(dayjs("2014-08-18T21:11:54"));

  // faq list
  useEffect(() => {
    dispatch(faq_show());
  }, []);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <DashboardWrapper hasSidebar={true} headerType="search" page="user">
      <section className={styles.pageAccount}>
        <div className="dashboradHeadingCom">
          <h3 className="headingH3">FAQ</h3>
        </div>
        {/* <div className={styles.header_search_bar}>
          <div className={styles.search_field}>
            <Button>
              <Image src={assets.searchicon} alt="img" width={20} height={20} />
            </Button>
            <input type="text" placeholder="Search Product" />
          </div>
        </div> */}
        {faq_list.map((item) => {
          return (
            <div className={styles.accordian_bar}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
      </section>
    </DashboardWrapper>
  );
}

export default index;
