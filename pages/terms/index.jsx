import Seo from "@/components/SEO/Seo";
import Wrapper from "@/layout/Wrappers/Wrapper";
import  Container  from "@mui/material/Container";
import assets from "@/json/assest";
import Image from 'next/image';
import { Box, Grid } from '@mui/material';
import styles from "@/styles/pages/about.module.scss";
import { fetch_cmsData } from "@/api/functions/cms.api";


export async function getServerSideProps() {
 const res = await fetch_cmsData("terms-conditions");
  return {
    props: {
      termsCMSData: res?.data?.data,
    },
  };
}


const index = ({  termsCMSData }) => {
  return (
    <Wrapper>
      <Seo
        title="Terms & conditions"
        description="About us desc"
        image="/logo.svg"
        key="terms_condition"
      />
      <Container className="body_cont">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
              {/* <Grid item sm={5} xs={12}>
                <Image src={assets.ban01} alt="img" width={500} height={500} />
              </Grid> */}
              <Grid item sm={12} xs={12}>
                <div className={styles.cont_box1}>
                  <div dangerouslySetInnerHTML={{ __html: termsCMSData?.content }}></div>
                </div>
              </Grid>
          </Grid>
        </Box>                     
      </Container>
    </Wrapper>
  );
};

export default index;
