import { NextResponse } from "next/server";

// If the incoming request has the "token" cookie

export function middleware(request) {
  const hasToken = request.cookies.get("token")?.value;
  let userType = request.cookies.get("userDetails")?.value;
  let userCokkie = request.cookies.get("userchnagess");
  let changeUser = request.cookies.get("userchnagess")?.value;
  console.log(changeUser, "changeUser");
 

  // For  Technician Switch
  if (hasToken?.length === 0 || hasToken === undefined || hasToken === null) {
    request.nextUrl.pathname = "/login";
    return NextResponse.redirect(request.nextUrl);
  } else {
    if (userCokkie) {
      let changeUser = request.cookies.get("userchnagess")?.value;
      if (
        request.nextUrl.pathname.startsWith("/service") &&
        changeUser === "Both"
      ) {
        return NextResponse.next();
      }
    } 
  }
// change user
  if( request.nextUrl.pathname.startsWith("/service") &&
  userCokkie === undefined ){
    return NextResponse.next();
  }

  // For Customer switch
  if (hasToken?.length === 0 || hasToken === undefined || hasToken === null) {
    request.nextUrl.pathname = "/login";
    return NextResponse.redirect(request.nextUrl);
  } else {
    if (userCokkie) {
      let changeUser = request.cookies.get("userchnagess")?.value;
      if (
        request.nextUrl.pathname.startsWith("/user") &&
        changeUser === "Both"
      ) {
        return NextResponse.next();
      }
    } 
  }

  
  console.log(userCokkie,"userCokkie");

  if (userType) {
    userType = JSON.parse(userType);
  } else {
    userType = {};
  }

  // if (changeUser) {
  //   changeUser = JSON.parse(changeUser);
  // } else {
  //   changeUser = {};
  // }

  //console.log(userType,"usertpeeeee");

  if (hasToken?.length === 0 || hasToken === undefined || hasToken === null) {
    request.nextUrl.pathname = "/login";
    return NextResponse.redirect(request.nextUrl);
  } else {
    if (
      userType?.length > 0 ||
      userCokkie !== null ||
      userCokkie ||
      userCokkie !== undefined ||
      userType !== undefined ||
      userType !== null ||
      changeUser !== undefined 
    ) {
      if (
        request.nextUrl.pathname.startsWith("/user") &&
        userType?.data?.user_type === "Customer"
      ) {
        return NextResponse.next();
      } else if (
        request.nextUrl.pathname.startsWith("/service") &&
        userType?.data?.user_type === "Technician"
      ) {
        return NextResponse.next();
      } else if (
        request.nextUrl.pathname.startsWith("/user") &&
        userType?.data?.isSignupCompleted === false &&
        userType?.data?.account_verified === false &&
        userType?.data?.user_type === "Technician"
      ) {
        return NextResponse.next();
      } 
      
      else if (userCokkie !== undefined) {
        if (request.nextUrl.pathname.startsWith("/service") &&
          changeUser === "Both") {

          return NextResponse.next();
        }
      } else if (
        request.nextUrl.pathname.startsWith("/user") &&
        userType?.data?.user_type === "Both"
      ) {
        return NextResponse.next();
      } else {
        request.nextUrl.pathname = "/login";
        return NextResponse.redirect(request.nextUrl);
      }
    } else {
      request.nextUrl.pathname = "/login";
      return NextResponse.redirect(request.nextUrl);
    }
  }
}

export const config = {
  matcher: [
    "//chat",
    "/user/cart",
    "/user/checkout",
    "/user/checkout/paymentOption",
    "/user/dashboard",
    "/user/dashboard/account",
    "/user/dashboard/faq",
    "/user/dashboard/feedback",
    "/user/dashboard/jobs",
    "/user/dashboard/order",
    "/user/dashboard/serviceprovider",
    "/user/dashboard/studio",
    "/user/dashboard/logout",
    "/user/productdetails",
    "/user/dashboard/appointments",
    "/user/products",
    // "/user/searchlisting",
    "/user/paymentFailed",
    "/user/successPyment",
    "/user/service/home",
    "/user/serviceproviderdetails",
    "/user/dashboard/serviceprovider",
    "/user/storedetails",
    "/user/training",
    "/user/trainingdetails",
    //service
    "/service/chat",
    "/service/reports",
    "/service/account",
    "/service/jobs",
    "/service/jobs/create",
    "/service/dashboard",
    "/service/order",
    "/service/product",
    "/service/product/create",
    "/service/reports",
    "/service/service",
    "/service/service/create",
    "/service/studio",
    "/service/studio/create",
    "/service/subscription",
    "/service/training",
    "/service/training/create",
    "/service/notverify",
    "/service/booking-history",
    // "/forgetPasswordRequest",
    // "/forgot-password",
    // "/reset-password",

  ],
};
