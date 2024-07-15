import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cart.slice";
import globalSlice from "./global.slice";
import profileSlice from "./profile.slice";
import TestSliceSlice from "./TestSlice";
import authSlice from "./auth.slice";
import jobsSlice from "./jobs.slice";
import DashboardSlice from "./dashboardSlice";
import ProductSlice from "./productSlice";
import ServiceProviderSlice from "./serviceProvider.slice";
import TrainingSlice from "./trainingSlice";
import BlogSlice from "./blogSlice";
import ContactSlice from "./contactSlice";

export const store = configureStore({
  reducer: {
    testSlice: TestSliceSlice,
    global: globalSlice,
    profile: profileSlice,
    cart: cartSlice,
    auth: authSlice,
    jobs: jobsSlice,
    dashbord: DashboardSlice,
    product: ProductSlice,
    serviceProvider: ServiceProviderSlice,
    training: TrainingSlice,
    blog:BlogSlice,
    contact:ContactSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
