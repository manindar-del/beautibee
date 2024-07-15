/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import "@/styles/global.scss";
import { Provider } from "react-redux";
import { store } from "@/reduxtoolkit/store";
import ThemeCustomization from "@/themes/index";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NextNProgress from "nextjs-progressbar";
import { SnackbarProvider } from "notistack";
import jwt_decode from "jwt-decode";
import { Cookies } from "react-cookie";
import "swiper/css";
import "swiper/css/effect-cards";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import "@/styles/DatePickerStyle/style.css";
import "leaflet/dist/leaflet.css";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      // refetchOnMount: false,
    },
  },
});
// import moment from "moment";
const CssBaseline = dynamic(() => import("@mui/material/CssBaseline"));

function MyApp({ Component, pageProps }) {
  const cookie = new Cookies();
  let token = cookie.get("token");
  // let remember_me = cookie.get("remember_me");
  // console.log("🚀 ~ file: _app.jsx:20 ~ MyApp ~ remember_me", remember_me);

  /* Checking if the token is expired or not. */
  if (token) {
    var decoded = jwt_decode(token);
    let expirationDate = decoded.exp;
    var current_time = Date.now() / 1000;
    if (expirationDate < current_time) {
      cookie.remove("userDetails", { path: "/" });
      cookie.remove("token", { path: "/" });
      window.location.href = "/";
    }
  }

  //const stripePromise = loadStripe('pk_test_51NC8juH8DTESxykdMLuQqFAyDY7Zr6bynV7U961EXoD0cufh8oiv3qb8mppMMixOe2dibNEIjBfpNgwqzpICEeg800YKxDHyj6');

  


  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydratedState}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={2000}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <ThemeCustomization>
              <NextNProgress
                height={5}
                color="#FFC000"
                options={{ showSpinner: false }}
              />
              <CssBaseline />
              {/* <Elements stripe={stripePromise} > */}
              <Component {...pageProps} />
              {/* </Elements> */}
            </ThemeCustomization>
          </SnackbarProvider>
        </Hydrate>
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
