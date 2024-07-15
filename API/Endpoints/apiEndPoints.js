export const baseURL = "https://beautibee.dedicateddevelopers.us/api";
export const mediaPath = "https://beautibee.dedicateddevelopers.us";
export const socketUrl = "https://beautibee.dedicateddevelopers.us";
export const others_api_end_points = {
  getProfileDetails: "/user/details",
  updateProfileDetails: "/user/update-profile",
  getAllJobsList: "/job/list",
  getJobDetails: "/job/detail",
  addToJobFavorite: "/job/favorite",
  applyToJob: "/job/apply",
  reportJob: "/job/report",
  job_categories: "/job/categoies",
  faqList: "/faq/list",
  feedBackAdd: "feedback/service/add",
  serviceList: "service/list",
  studioList: "/studio/list",
  jobApplyList: "job/technician/apply-list",
  studioDetails: "/studio/detail",
  getTechnicianList: "/user/technician-listing",
  getTechnicianDetails: "/user/get-technician",
  trainingList: "/training/list",
  trainingDetails: "/training/detail",
  productList: "/product/list",
  productDetails: "/product/detail",
  product_categories: "product/categoies",
  productAddToCart: "/cart/add",
  getAllCartList: "/cart/list",
  deleteCart: "/cart/delete",
  updateCart: "/cart/update",
  blogList: "/blog/list",
  blogDetails: "/blog/detail",
  contact: "/contact/add",
  badgeList: "/badge/list",
  trainingAdd: "/training/insert",
  jobCreate: "/job/insert",
  studioAdd: "/studio/insert",
  jobAdd: "/job/insert",
  allJobs: "/job/list",
  userWiseJobList: "/job/user-wise-list",
  productAdd: "/product/insert",
  userWiseProductList: "/product/user-wise-list",
  userWiseTrainingList: "/training/user-list",
  userWiseStudioList: "/studio/user-list",
  serviceAdd: "/service/add",
  serviceListing: "/service/provider-list",
  technicianServiceList:"/service/my-provider-list",
  exprienceList: "/service/experience",
  serviceDetails: "service/details",
  serviceUpdate: "/service/update",
  deleteService: "/service/delete",
  deleteProduct: "/product/delete",
  productUpdate: "/product/update",
  trainingUpdate: "/training/update",
  deleteTraining: "/training/delete",
  studioCategory: "/studio/categoies",
  serviceCategory: "/service/category-list",
  studioUpdate: "/studio/update",
  deleteStudio: "/studio/delete",
  jobUpdate: "/job/update",
  deleteJob: "/job/delete",
  orderList: "/order/provider/list",
  orderUserList: "/order/list",
  countrySelect: "/user/country-state-city",
  //checkout: "/order/checkout",
  checkout: "/order/create-payment-intent",         
  forgetPassword: "/user/forget-Password-request",
  verifyEmail:"/user/forget-Password-verify",
  resetPassword:"/user/reset-password",

  userTechnicianFavourite: "/user/technician-favorite",
  userTechnicianServiceExist: "/user/technician/service-exist",
  userTechnicianListById: "/service/technician/list",
  serviceSearch: "/service/search",
  timeSlot: "service/time-slot",
  createServiceBookingAdd: "/booking/service/add",
  getAllServiceBookingList: "/booking/service/list",
  deleteServiceBookingList: "/booking/service/delete",
  getAllTimeSlot: "/booking/time-slot",
  editBookingSlot: "/booking/service/edit",
  //bookingConfirm: "/booking/confirm",
  bookingConfirm: "/booking/create-payment-intent",
  bookingAppList: "/booking/customer-booking",
  subscriptionPlan: "/subscription/plan-list",
  //subscriptionNew: "/subscription/new",
  subscriptionNew:"/subscription/create-payment-intent",
  subscriptionSwitchPlan: "/subscription/switch/plan",
  providerBookingAppList: "/booking/provider-booking",
  cancelSubscription: "/subscription/cancel",
  freeSubscription:"/subscription/new/free",
  report: "/service/report",
  countReport: "/service/countreport",
  userApplyList: "/job/user/apply-list",
  changeRole: "/user/role/change",
  changeOrderStatus: "/order/provider/status",
  userTechnicianRating: "/user/technician-rating",  
  providerBookingDate: "/booking/provider-booking-date-list",
  providerBookingDateDetails: "/booking/provider-booking-date-details",
  bookingProviderStatus: "/booking/provider/status",
  newsLetter: "/newsletter/add",
  socialSetting: "/settings/data",
};

export const cms_end_point = {
  cms: "/cms/list",
  homepage: "cms/homepage",
  blog: "blog/list",
  partner: "partner/list",
  categories: "product/categoies",
  service_homepage: "/cms/service/homepage",
  testimonial: "/testimonial/list",
};

export const auth_end_point = {
  signUpUser: "/user/signup",
  signInUser: "/user/signin",
  signInUserWithSocial: "/user/social-signup",
};
