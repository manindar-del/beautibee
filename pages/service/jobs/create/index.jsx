import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useState } from "react";
import styles from "@/styles/service/addjobs.module.scss";
import { Container } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { useRouter } from "next/router";
import { regexFormat } from "@/json/regex/regexFormat";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import JobForm from "@/components/JobsForm";
import { error } from "@/json/customSms/cumtomSms";

import {
  useGetCategory,
  useCreateJob,
  useGetAllCountry,
} from "@/hooks/useJobs";
/* A validation schema for the form. */
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required(" Job Title is required!")
    .max(255, "Oops! You can not enter more the 255 characters"),
  content: Yup.string()
    .required("Job Details is required!")
    .max(255, "Oops! You can not enter more the 255 characters"),
  job_category: Yup.string().required("Category is required!"),

  pay_upto: Yup.number()
    .required("Job price is required!")
    .positive("Job price must be positive number")
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    ),
 
  phone: Yup.string()
    .required("Phone number is required!")
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .min(10, "Oops! minimum 10 characters")
    .max(10, "Oops! You can not enter more the 10 characters"),
  email: Yup.string().required(error.email).email(error.emailFormat),
  company: Yup.string()
    .required("Company is required!")
    .max(20, "Oops! You can not enter more the 20 characters"),
  location: Yup.string()
    .required("Location is required!")
    .max(255, "Oops! You can not enter more the 255 characters"),
  position: Yup.string().required("Position is required!"),
  require_member: Yup.string().required("Member size is required!"),
  job_type: Yup.string().required("Job type is required!"),
  experience: Yup.string().required("Experience is required!"),
  end_date: Yup.string().nullable().required("Please enter your End Date!"),
  country: Yup.string().required("Country is required!"),
  city: Yup.string().required("State is required!"),
  zipcode: Yup.string()
    .required("Zipcode is required!")
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Zipcode is not valid"
    )
    .max(11, "Oops! You can not enter more the 11 characters"),

  isUrgent: Yup.string().required("Urgent is required!"),
});

const formOptions = {
  resolver: yupResolver(validationSchema),
  mode: "all",
};
function Index() {
  const router = useRouter();
  const [endDate, setEndDate] = useState(null);
  const { data } = useGetCategory();
  const { mutate: createJob } = useCreateJob();
  const { data: countryList } = useGetAllCountry();

  const { register, handleSubmit, formState, getValues, control, setValue, watch } =
    useForm(formOptions);
  const { errors } = formState;

  /**
   * The function takes in a newValue, and sets the endDate to that newValue
   */
  const handleChangeDate = (newValue) => {
    setEndDate(newValue);
  };

  /**
   * It takes the data from the form and sends it to the createJob function
   */
  const handleSubmitFormData = (data) => {
    createJob(data);
  };

  return (
    <DashboardWrapper headerType="search" page="service">
      <Container>
        <div className={styles.jobs_wrapper}>
          <div className={styles.heading_top}>
            <h3
              className="headingH3 pointerBtn"
              onClick={() => router.push("/service/jobs")}
            >
              <KeyboardBackspaceIcon /> Jobs
            </h3>
          </div>
          <JobForm
            formType={"Create"}
            styles={styles}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            handleSubmitFormData={handleSubmitFormData}
            handleChangeDate={handleChangeDate}
            endDate={endDate}
            Controller={Controller}
            watch={watch}
            control={control}
            allCategoryList={data?.pages[0]?.data}
            allCountryList={countryList?.pages[0]?.data}
            setValue={setValue}
          />
        </div>
      </Container>
    </DashboardWrapper>
  );
}

export default Index;
