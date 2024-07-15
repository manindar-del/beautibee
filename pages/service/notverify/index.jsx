import Seo from "@/components/SEO/Seo";
import Wrapper from "@/layout/Wrappers/Wrapper";
import Container from "@mui/material/Container";
import styles from "@/styles/pages/about.module.scss";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";


const NotVerify = () => {
  return (
    <Wrapper headerType="notverify" page="service">
      <Seo
        title="Not Verify"
        description="Not Verify"
        image="/logo.svg"
        key="Not_Verify"
      />
      <Container className="body_cont">
          <h2 style ={{textAlign:"center"}}> You Are Not Verified. Please complete Profile First </h2>
        
      </Container>
    </Wrapper>
  );
};

export default NotVerify;
