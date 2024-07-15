import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/contact.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { notiStackType } from "@/json/notiJson/notiJson";
import { contact_form_add } from "../../ReduxToolkit/contactSlice";

function index({ ratingValue }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const {  contact_add } = useSelector(
    (state) => state?.contact
  );
 

  //console.log(contact_add,"contact_add");
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  let name, value;
  /**
   * The function takes an event as an argument, and then sets the name and value of the event target to
   * the name and value variables. Then, it sets the inputData state to the inputData object with the
   * name and value variables
   */
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  /**
   * It checks if the input fields are empty, if they are, it returns an error object with the
   * corresponding error message
   * @returns an object with the keys of name, email, phone, subject, and message.
   */
  const validation = () => {
    let error = {};
    if (!inputData.name) {
      error.name = "Name is required";
    }
    if (!inputData.email) {
      error.email = "Email address is required";
    } else if (
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        inputData.email
      )
    ) {
      error.email = "Enter a valid email";
    }

    if (!inputData.phone) {
      error.phone = "Phone number is required";
    } else if (inputData.phone.length > 10) {
      error.phone = "Maximum 10 characters";
    } else if (inputData.phone.length < 10) {
      error.phone = "minimum 10 characters";
    }
    var array=inputData.phone.split('');
    if(array.indexOf(".") >= 0){
      error.phone = "Phone number is not a decimal number";
    }

    if (!inputData.subject) {
      error.subject = "Subject is required";
    }

    if (!inputData.message) {
      error.message = "Message is required";
    }

    return error;
  };

  /**
   * A function that is called when the user clicks on the submit button.
   */
  const add = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let formData = new FormData();
    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      formData.append("name", inputData.name);
      formData.append("email", inputData.email);
      formData.append("phone", inputData.phone);
      formData.append("subject", inputData.subject);
      formData.append("message", inputData.message);

      dispatch(contact_form_add(formData))
        .then((res) => {
          if (res?.payload?.status === 200) {
            enqueueSnackbar(res?.payload?.message, notiStackType.success);
            setIsLoading(false);
          } else {
            enqueueSnackbar("Form not submit", notiStackType.error);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };


  useEffect(()=>{
    if(contact_add){
      setInputData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }
   
  },[contact_add])

  return (
    <DashboardWrapper headerType="search">
      <div className={styles.feedback_wrapper}>
        <div className="container">
          <div className={styles.contact_sec}>
            <h4>Contact Us</h4>
            <div className={styles.feedback_full_wrapper}>
              <div className={styles.feedback_input}>
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  onChange={postUserData}
                  value={inputData.name}
                  placeholder="Enter Name"
                />
                <div className="error">{error.name}</div>
              </div>
              <div className={styles.feedback_input}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  onChange={postUserData}
                  value={inputData.email}
                  placeholder="Enter Email"
                />
                <div className="error">{error.email}</div>
              </div>

              <div className={styles.feedback_input}>
                <label>Phone *</label>
                <input
                  type="number"
                  name="phone"
                  onChange={postUserData}
                  value={inputData.phone}
                  placeholder="Enter Phone Number"
                />
                <div className="error">{error.phone}</div>
              </div>

              <div className={styles.feedback_input}>
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  onChange={postUserData}
                  value={inputData.subject}
                  placeholder="Enter Subject"
                />
              </div>
              <div className="error">{error.subject}</div>

              <div className={styles.feedback_input}>
                <label>Message *</label>
                <textarea
                  rows={3}
                  name="message"
                  onChange={postUserData}
                  value={inputData.message}
                  placeholder="Enter Message"
                />
              </div>
              <div className="error">{error.message}</div>

              <div className={styles.feedback_input}>
                <button type="button" onClick={add} className="change_logo_btn">
                 {isLoading ? "...Loading" : "Submit" } 
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default index;
