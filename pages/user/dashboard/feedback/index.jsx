import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/feedback.module.scss";
import MuiRating from "@/components/Rating/Rating";
//import { useLocation, useParams } from "react-router-dom";
import {
  feedback_add,
  service_list,
} from "../../../../ReduxToolkit/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { notiStackType } from "@/json/notiJson/notiJson";
import { useMutation, useQuery } from "react-query";
import {
  useTechnicianService,
  useServiceTechnicianList,
} from "@/hooks/useTechnicianFeedback";

function index({ ratingValue }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState({});
  //console.log(error, "error");
  //const [service_id, setService_id] = useState("");

  const [serviceSelect, setServiceSelect] = useState("");

  const [technicianSelect, setTechnicianSelect] = useState("");

  const { data: technicianServiceExist } = useTechnicianService();

  const { data: technicianServiceList } = useQuery(
    ["feedback", serviceSelect],
    () => useServiceTechnicianList(serviceSelect)
  );

  const [inputData, setInputData] = useState({
    comment: "",
  });

  const [values, setValues] = React.useState(0);

  const ratingChanged = (newValue) => {
    setValues(newValue);
  };


  //const { service_list_show } = useSelector((state) => state?.dashbord);

  //inputfield onchange function
  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  useEffect(() => {
    dispatch(service_list());
  }, []);

  /**
   * It returns an object with the keys of the fields that have errors, and the values of the error
   * messages
   * @returns return (
   *     <div className="container">
   *       <div className="row">
   *         <div className="col-md-12">
   *           <div className="card">
   *             <div className="card-header">
   *               <h3>Add Review</h3>
   *             </div>
   *             <div className="
   */
  const validation = () => {
    let error = {};
    if (values == 0) {
      error.values = "Rating is required";
    }
    if (!inputData.comment) {
      error.comment = "Comment is required";
    }
    // if (service_id == "All Service" || service_id == "") {
    //   error.service_id = "Please select any one";
    // }

    if (!serviceSelect) {
      error.serviceSelect = "Service  is required";
    }

    if (!technicianSelect) {
      error.technicianSelect = "Technician List  is required";
    }

    return error;
  };

  const handleSelectChange = (e) => {
    setServiceSelect(e.target.value);
  };

  const handleSelectChangeList = (e) => {
    setTechnicianSelect(e.target.value);
  };

  //add feeback
  const add = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let temp = [];

    // service_list_show?.map((_service) => {
    //   return temp.push(_service?.title);
    // });

    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      formData.append("rating", values);
      formData.append("comment", inputData.comment);
      //  formData.append("service_id", service_id);
      formData.append("service_id", technicianSelect);
      // formData.append("technician", technicianSelect);
      dispatch(feedback_add(formData))
        .then((res) => {
          if (res?.payload?.status === 200) {
            enqueueSnackbar(res?.payload?.message, notiStackType.success);
          } else {
            enqueueSnackbar(
              "Feedback already exist with this service",
              notiStackType.error
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <DashboardWrapper hasSidebar={true} headerType="search" page="user">
      <div className={styles.feedback_wrapper}>
        <h4>Feedback & Rating</h4>

        <div className={styles.feedback_full_wrapper}>
          <div className={styles.feedback_input}>
            <label>Select Technician List</label>
            <select
              value={serviceSelect}
              onChange={handleSelectChange}
              name="service"
            >
              <option value="">-Select Technician List-</option>
              {technicianServiceExist?.pages[0]?.data?.length > 0 ? (
                technicianServiceExist?.pages[0]?.data?.map((item, i) => {
                  return (
                    <>
                      <option
                        value={
                          item._id === serviceSelect ? serviceSelect : item._id
                        }
                        key={i}
                        selected={
                          item.full_name === serviceSelect
                            ? serviceSelect
                            : item.full_name
                        }
                      >
                        {item.full_name}
                      </option>
                    </>
                  );
                })
              ) : (
                <option>No service available</option>
              )}
            </select>
            <div
              className="error"
              style={{
                fontSize: "15px",
                marginBottom: "5px",
                display: "contents",
              }}
            >
              {error.serviceSelect}
            </div>
          </div>

          <div className={styles.feedback_input}>
            <label>Select Services List</label>
            <select
              value={technicianSelect}
              onChange={handleSelectChangeList}
              name="list"
            >
              <option value="">Select Services List</option>
              {technicianServiceList?.data?.data?.length &&
                technicianServiceList?.data?.data.map((item, i) => {
                  return (
                    <>
                      <option
                        value={
                          item?._id == technicianSelect
                            ? technicianSelect
                            : item?._id
                        }
                        key={i}
                        selected={
                          item?.title == technicianSelect
                            ? technicianSelect
                            : item?.title
                        }
                      >
                        {item?.title}
                      </option>
                    </>
                  );
                })}
            </select>
            <div
              className="error"
              style={{
                fontSize: "15px",
                marginBottom: "5px",
                display: "contents",
              }}
            >
              {error.technicianSelect}
            </div>
          </div>

          {/* <div className={styles.feedback_input}>
            <select>
              <option>Choose Expert</option>
              <option>Choose Expert</option>
              <option>Choose Expert</option>
            </select>
          </div> */}

          <div className={styles.feedback_input}>
            <label>Select Rating</label>
            <div className={styles.feedback_rating}>
              <h5>Select Rating</h5>
              <div className={styles.rating_section}>
                <MuiRating onChangeRating={ratingChanged} />
              </div>
            </div>
          </div>
          <div
            className="error"
            style={{
              fontSize: "15px",
              marginBottom: "5px",
              display: "contents",
            }}
          >
            {error.values}
          </div>
          <div className={styles.feedback_input}>
            <label>Feedback</label>

            <textarea
              rows={3}
              name="comment"
              onChange={postUserData}
              value={inputData.comment}
              placeholder=" Give Feedback"
            />
          </div>
          <div
            className="error"
            style={{
              fontSize: "15px",
              marginBottom: "5px",
              display: "contents",
            }}
          >
            {error.comment}
          </div>
          <div className={styles.feedback_input}>
            <button type="button" onClick={add} className="change_logo_btn">
              Submit
            </button>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default index;
