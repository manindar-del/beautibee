import React, { useState, useEffect } from "react";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/service/addjobs.module.scss";
import { Container } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import JobForm from "@/components/JobsForm";
import { error } from "@/json/customSms/cumtomSms";
import {
  useGetCategory,
  useCreateJob,
  GetJobDetails,
  useUpdateJob,
  useGetAllCountry,
} from "@/hooks/useJobs";

/* A validation schema for the form. */
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required(" Job Title is required!")
    .max(255, "Oops! You can not enter more the 255 characters"),
  content: Yup.string()
    .required("Jon Details is required!")
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
const EditJob = () => {
  const router = useRouter();
  const [endDate, setEndDate] = useState(null);
  const { data } = useGetCategory();
  const { data: countryList } = useGetAllCountry();

  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
    control,
    watch,
    reset,
  } = useForm(formOptions);
  const { errors } = formState;

  const handleChangeDate = (newValue) => {
    setEndDate(newValue);
  };

  const { mutate: updateJob } = useUpdateJob();

  /**
   * It's a function that takes in data, and if the router query id exists, it will update the job
   */
  const handleSubmitFormData = (data) => {
    if (router.query.id) {
      updateJob(data);
    }
  };

  // console.log(watch(),"watchs")

  /* This is a useEffect hook. It is used to fetch the data from the API and set the value of the form. */
  useEffect(() => {
    if (router.query.id) {
      GetJobDetails(router.query.id).then((data) => {
        reset(data?.data?.job);

        // setValue("title", data?.data?.job?.title);
        // setValue("content", data?.data?.job?.content);
        // setValue("job_category", data?.data?.job?.job_category);
        // setValue("pay_upto", data?.data?.job?.pay_upto);
        // setValue("phone", data?.data?.job?.phone);
        // setValue("email", data?.data?.job?.email);
        // setValue("company", data?.data?.job?.company);
        // setValue("location", data?.data?.job?.location);
        // setValue("position", data?.data?.job?.position);
        // setValue("require_member", data?.data?.job?.require_member);
        // setValue("job_type", data?.data?.job?.job_type);
        // setValue("isUrgent", data?.data?.job?.isUrgent);
        // setValue("experience", data?.data?.job?.experience);
        // setValue("end_date", data?.data?.job?.end_date);
        // setValue("country", data?.data?.job?.country);
        setValue("city", data?.data?.job?.city);
        // setValue("zipcode", data?.data?.job?.zipcode);
        setValue("id", router.query.id);
      });
    }
  }, [router.query.id]);

  return (
    <>
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
              formType="Edit"
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
              reset={reset}
              setValue={setValue}
            />
          </div>
        </Container>
      </DashboardWrapper>
    </>
  );
};

export default EditJob;
