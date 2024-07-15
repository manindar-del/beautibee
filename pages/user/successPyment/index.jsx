import Wrapper from "@/layout/Wrappers/Wrapper";
import Container from "@mui/material/Container";
import { Player } from "@lottiefiles/react-lottie-player";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";

const PaymentInfoPage = () => {
  return (
    <Wrapper headerType="payment" page="user">
      <Container className="body_cont_paymentsuccess">
        <Card elevation={5} sx={{ minWidth: 275, borderRadius: 5 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              <Player
                src="https://assets5.lottiefiles.com/packages/lf20_k6ciq2nn.json"
                className="player"
                loop
                autoplay
                style={{ height: "300px", width: "300px" }}
              />
            </Typography>
          </CardContent>
          <CardActions>
            <div className="text-center">
              <h2>Payment Successfully Done!</h2>
              <Button
                style={{ border: "1px solid #F4BC00", background: "#F4BC00" }}
                variant="text"
              >
                <Link
                  style={{ color: "#ffff", fontWeight: 600 }}
                  href="/user/products"
                >
                  Go To Shop Page{" "}
                </Link>
              </Button>
            </div>
          </CardActions>
        </Card>
      </Container>
    </Wrapper>
  );
};

export default PaymentInfoPage;
