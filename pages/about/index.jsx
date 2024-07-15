import Seo from "@/components/SEO/Seo";
import Wrapper from "@/layout/Wrappers/Wrapper";
import Container from "@mui/material/Container";
import assets from "@/json/assest";
import Image from "next/image";
import { Box, Grid } from "@mui/material";
import styles from "@/styles/pages/about.module.scss";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { fetch_cmsData } from "@/api/functions/cms.api";

export async function getServerSideProps() {
  const res = await fetch_cmsData("about-us");
  return {
    props: {
      aboutCMSData: res?.data?.data,
    },
  };
}
const AboutPage = ({ aboutCMSData }) => {
  console.log(aboutCMSData,"aboutCMSData");
  return (
    <div className="box_switch">
    <Wrapper>
      <Seo
        title="About us"
        description="About us desc"
        image="/logo.svg"
        key="about_us"
      />
      <Container className="body_cont">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item sm={5} xs={12}>
              {/* <Image src={assets.ban01} alt="img" width={500} height={500} /> */}
              <Image
                src={`${mediaPath}/uploads/cms/${aboutCMSData?.image}`}
                width={500}
                height={500}
              />
            </Grid>
            <Grid item sm={7} xs={12}>
              <div className={styles.cont_box}>
                <h2>About Us</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: aboutCMSData?.content }}
                ></div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Wrapper>
    </div>
  );
};

export default AboutPage;
