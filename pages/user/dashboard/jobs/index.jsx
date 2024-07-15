import React, { useState, useEffect } from "react";
import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/pages/jobs.module.scss";
import Image from "next/image";
import assets from "@/json/assest";
import Rating from "@/components/Rating/Rating";
import { useGetAllJobApplyList } from "@/hooks/useJobs";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import JobCardBadge from "@/ui/Badge/JobCardBadge";
// import colors from "@/styles/abstracts/_variable.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Button, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  getAllJobs,
  getJobsDetails,
  addToFavJobs,
  reportJobPost,
  applyToJobs,
} from "@/reduxtoolkit/jobs.slice";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import assest from "@/json/assest";
import moment from "moment/moment";
import { Cookies } from "react-cookie";
import { useSnackbar } from "notistack";
import { notiStackType } from "@/json/notiJson/notiJson";
import Groups3Icon from "@mui/icons-material/Groups3";
import { styled, alpha } from "@mui/material/styles";

// import Pagination from "@mui/material/Pagination";
// import PaginationItem from "@mui/material/PaginationItem";
// import Stack from "@mui/material/Stack";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const style = {
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const style2 = {
  width: 250,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const styleH4 = {
  display: "flex",
  justifyContent: "center",
  margin: "30px",
};

const CancelBtn = {
  background: "red",
  fontSize: "15px",
  color: "white",
  padding: "10px 30px",
  border: "2px solid red",
  borderRadius: "10px",
  margin: "0 0 0 10px",
};

const disabled = {
  background: "#606060",
};

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function Index() {
  const cookie = new Cookies();
  const dispatch = useDispatch();
  let userDetails = cookie.get("userDetails");
  const { enqueueSnackbar } = useSnackbar();
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openApplicantModal, setOpenApplicantModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [jobId, setJobId] = useState("");
  const [error, setError] = useState({});
  const [reportText, setReportText] = useState({
    Message: "",
  });

  const { isJobsLoading, getAllJobsData, getJobDetail } = useSelector(
    (store) => store.jobs
  );

  const { data: applyListOfUser, mutate: userApplyList } =
    useGetAllJobApplyList();

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  /* Calling the getAllJobs action creator when the component mounts. */
  useEffect(() => {
    dispatch(
      getAllJobs({
        user_id: userDetails?.data?._id,
        pagination_page: 1,
        pagination_per_page: 5,
      })
    );
  }, []);

  /**
   * This function is used to open the job details modal and get the job details from the database
   */
  const handleOpenJobDetails = (id, userID) => {
    let data = {
      id: id,
      userID: userID,
    };
    setOpen(true);
    dispatch(getJobsDetails(data));
  };

  const handleCloseJobDetails = () => setOpen(false);

  /**
   * It dispatches an action to add a job to the user's favorite jobs list, and then dispatches an action
   * to get all jobs for the user
   */
  const addToFavoriteJob = (jobID) => {
    dispatch(
      addToFavJobs({
        job_id: jobID,
      })
    )
      .then((res) => {
        if (res?.payload?.status) {
          dispatch(
            getAllJobs({
              user_id: userDetails?.data?._id,
              pagination_page: 1,
              pagination_per_page: 5,
            })
          );
          enqueueSnackbar(res?.payload?.message, notiStackType.success);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /* Setting the state of the reportText object. */
  let name, value;
  /**
   * The function takes an event as an argument, and then sets the state of the reportText object to the
   * value of the event.target.value
   */
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setReportText({ ...reportText, [name]: value });
  };

  /**
   * The validation function is called when the user clicks the submit button. If the user has not
   * entered any text in the textarea, an error message is displayed
   * @returns The error object is being returned.
   */
  const validation = () => {
    let error = {};

    if (!reportText.Message) {
      error.Message = "Message is required";
    }
    return error;
  };

  /**
   * ReportJobPosts() is a function that takes in an id as a parameter and returns a formData object that
   * contains the reportText.Message
   */
  const reportJobPosts = (id) => {
    let formData = new FormData();
    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      formData.append("Message", reportText.Message);
      dispatch(
        reportJobPost({
          formData,
          job_id: id,
          message: reportText,
        })
      )
        .then((res) => {
          if (res?.payload?.status) {
            enqueueSnackbar(res?.payload?.message, notiStackType.success);
            setOpenReportModal(false);
            setReportText({ ...reportText, Message: "" });
          } else {
            enqueueSnackbar("Already report this post!", notiStackType.error);
            setOpenReportModal(false);
            setReportText({ ...reportText, Message: "" });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  /**
   * If the image fails to load, replace it with a placeholder image
   */
  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };

  /**
   * It dispatches an action to apply to a job, and if the response is successful, it closes the modal
   * and shows a notification
   */
  const applyJob = () => {
    dispatch(applyToJobs({ job_id: jobId }))
      .then((res) => {
        if (res?.payload?.status) {
          setOpenApplyModal(false);
          enqueueSnackbar(res?.payload?.message, notiStackType.success);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [menuId, setMenuId] = React.useState(null);
  /**
   * When the user clicks on a menu item, the menuId state is set to the id of the menu item that was
   * clicked.
   */
  const openIndividualMenu = (id) => {
    setMenuId(id);
  };

  /**
   * It gets all the apply list for a job.
   */
  const getAllApplyList = (id) => {
    userApplyList({
      job_id: id,
      pagination_page: 1,
      pagination_per_page: 10,
    });
  };

  return (
    <DashboardWrapper hasSidebar={true} headerType="search" page="user">
      <div className={styles.jobs_wrapper}>
        <h4>Jobs</h4>
        <div className={styles.jobs_full_wrapper}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {isJobsLoading && getAllJobsData !== null ? (
                <>
                  {getAllJobsData?.data?.map((item, i) => (
                    <Grid item md={6} xs={12} key={i}>
                      <div className={styles.jobs_box}>
                        <div
                          style={{ cursor: "pointer" }}
                          className={styles.jobs_box_ul}
                          onClick={() =>
                            handleOpenJobDetails(
                              item?._id,
                              userDetails?.data?._id
                            )
                          }
                        >
                          <h3>{item?.title}</h3>

                          <ul>
                            <li>
                              <div className={styles.badge_button}>
                                <JobCardBadge
                                  color={item?.color}
                                  background={item?.background}
                                  text={item?.category_info?.title}
                                />
                              </div>
                            </li>
                            <li>
                              {moment(item?.createdAt).format("MM/DD/YYYY") <
                              moment().format("MM/DD/YYYY") ? (
                                <>
                                  {moment(item?.createdAt).format("DD MMM YY")}
                                </>
                              ) : (
                                <>{moment(item?.createdAt).format("hh")} ago</>
                              )}
                            </li>
                            <li>
                              <Image
                                src={assest?.phoneSVG}
                                width={9}
                                height={12}
                              />{" "}
                              <span>{item?.user_info?.email}</span>
                            </li>
                          </ul>
                        </div>
                        <div className={styles.jobs_profile}>
                          <img
                            src={
                              item?.user_info?.profile_image !== null
                                ? `${mediaPath}/uploads/user/profile_pic/${item?.user_info?.profile_image}`
                                : assest.noImage
                            }
                            width={48}
                            height={48}
                            onError={onErrorImg}
                          />

                          <h5>{item?.company}</h5>
                        </div>
                        <div className={styles.jobs_link}>
                          <ul>
                            <li>
                              <Link href="">
                                <Image
                                  src={assest?.locationicon}
                                  width={16}
                                  height={16}
                                />
                                <span style ={{fontSize: "9px",fontWeight: "700"}}>{item?.location}</span>
                              </Link>
                            </li>
                            <li>
                              <Link href="">
                                <Image
                                  src={assest?.clockicon}
                                  width={16}
                                  height={16}
                                />
                                <span>{item?.job_type}</span>
                              </Link>
                            </li>
                            <li>
                              <span>{item?.experience}</span>
                            </li>
                          </ul>
                        </div>

                        <div className={styles.jobs_heart}>
                          <Image
                            src={
                              item?.isFavorite
                                ? assets?.hearticonFill
                                : assets?.hearticon
                            }
                            width={20}
                            height={18}
                            onClick={() => addToFavoriteJob(item?._id)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        {/* <IconButton
                          className={styles.jobs_apply}
                          id="demo-customized-button"
                          aria-controls={
                            openMenu
                              ? `demo-customized-menu-${item._id}`
                              : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={openMenu ? "true" : undefined}
                          variant="contained"
                          disableElevation
                          onClick={(e) => {
                            handleClickMenu(e);
                            openIndividualMenu(item._id);
                          }}
                        >
                          <Image
                            src={assest.threedots}
                            width={20}
                            height={18}
                          />
                        </IconButton> */}
                        <Menu
                          // sx={{
                          //   mr: 5,
                          // }}
                          className={styles.jobs_apply}
                          id={`demo-customized-menu-${item._id}`}
                          MenuListProps={{
                            "aria-labelledby": `demo-customized-menu-${item._id}`,
                          }}
                          anchorEl={anchorEl}
                          open={menuId === item._id && openMenu ? true : false}
                          onClose={() => {
                            handleCloseMenu();
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              setOpenApplicantModal(true);
                              handleCloseMenu();
                              getAllApplyList(item._id);
                            }}
                          >
                            <Groups3Icon />
                            View application
                          </MenuItem>
                        </Menu>
                      </div>
                    </Grid>
                  ))}
                </>
              ) : (
                <>loading...</>
              )}

              <Dialog
                open={open}
                onClose={handleCloseJobDetails}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="jobs_modal"
                scroll={"body"}
              >
                <Box sx={style}>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <div className={styles.modal_cont}>
                      <div className={styles.left_cont}>
                        <img
                          src={
                            getJobDetail?.user?.profile_image !== null
                              ? `${mediaPath}/uploads/user/profile_pic/${getJobDetail?.user?.profile_image}`
                              : assest.noImage
                          }
                          width={48}
                          height={48}
                          onError={onErrorImg}
                        />
                        <div className={styles.heading_text}>
                          <h2>
                            {getJobDetail?.job?.title} <Rating />{" "}
                            {/* <span>853 reviews</span> */}
                          </h2>

                          <h3>
                            {getJobDetail?.job?.location}{" "}
                            <span>Urgent Requirement</span>
                          </h3>
                          <ul className={styles.listing_sec}>
                            <div className={styles.listing_top_box}>
                              <li>
                                <Image
                                  src={assets.jobdetailsicon1}
                                  width={14}
                                  height={14}
                                />{" "}
                                {moment(getJobDetail?.job?.createdAt).format(
                                  "DD MMM YY"
                                )}
                              </li>
                              {/* <li>
                                <Image
                                  src={assets.jobdetailsicon2}
                                  width={14}
                                  height={14}
                                />{" "}
                                19 Expert Required
                              </li> */}
                              <li>
                                <Image
                                  src={assets.jobdetailsicon3}
                                  width={14}
                                  height={14}
                                />{" "}
                                {getJobDetail?.job?.job_type}
                              </li>
                            </div>
                            <div className={styles.listing_top_box}>
                              {getJobDetail?.job?.position ? (
                                <li>
                                  <Image
                                    src={assets.jobdetailsicon4}
                                    width={14}
                                    height={14}
                                  />{" "}
                                  {getJobDetail?.job?.position}
                                </li>
                              ) : null}
                              <li>
                                <Image
                                  src={assets.jobdetailsicon5}
                                  width={14}
                                  height={14}
                                />{" "}
                                ${getJobDetail?.job?.pay_upto} Hourly
                              </li>
                            </div>
                          </ul>
                        </div>
                      </div>
                      <div className={styles.right_cont}>
                        <ul>
                          <li>
                            <Image
                              src={
                                getJobDetail?.isFavorite
                                  ? assets?.hearticonFill
                                  : assets?.hearticon
                              }
                              width={106}
                              height={106}
                              onClick={() => {
                                addToFavoriteJob(getJobDetail?.job?._id);
                                handleCloseJobDetails();
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          </li>
                          <li>
                            <button>Apply Now</button>
                          </li>
                        </ul>
                        <p>
                          Job Post :{" "}
                          {moment(getJobDetail?.job?.createdAt).format(
                            "DD MMM YYYY"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className={styles.cont_body}>
                      {/* <h2>Why Work Here?</h2>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book.
                      </p>
                    </div>
                    <div className={styles.purpose_cont}>
                      <ul>
                        <li>Date: 24-Sept-2022</li>
                        <li>Location: Melbourne, Australia</li>
                        <li>Company: Boutique Salon</li>
                      </ul>
                      <div className={styles.scroll_box}>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu
                          fugiat nulla pariatur. Excepteur sint occaecat
                          cupidatat non proident, sunt in culpa qui officia
                          deserunt mollit anim id est laborum.Lorem ipsum dolor
                          sit amet, consectetur adipiscing elit, sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua. Ut
                          enim ad minim veniam, quis nostrud exercitation
                          ullamco laboris nisi ut aliquip ex ea commodo
                          consequat. Duis aute irure dolor in reprehenderit in
                          voluptate velit esse cillum dolore eu fugiat nulla
                          pariatur. Excepteur sint occaecat cupidatat non
                          proident, sunt in culpa qui officia deserunt mollit
                          anim id est laborum.
                        </p>
                        <h2>Role Purpose</h2>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu
                          fugiat nulla pariatur. Excepteur sint occaecat
                          cupidatat non proident, sunt in culpa qui officia
                          deserunt mollit anim id est laborum.Lorem ipsum dolor
                          sit amet, consectetur adipiscing elit, sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua. Ut
                          enim ad minim veniam, quis nostrud exercitation
                          ullamco laboris nisi ut aliquip ex ea commodo
                          consequat. Duis aute irure dolor in reprehenderit in
                          voluptate velit esse cillum dolore eu fugiat nulla
                          pariatur. Excepteur sint occaecat cupidatat non
                          proident, sunt in culpa qui officia deserunt mollit
                          anim id est laborum.
                        </p>
                      </div>

                      <h2>
                        Main accountabilities<br></br> Customer Experience and
                        Sales:
                      </h2>
                      <ul className={styles.purpose_cont_details}>
                        <li>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod
                        </li>
                        <li>Lorem ipsum dolor sit amet, consectetur</li>
                        <li>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                        </li>
                      </ul>
                      <div className={styles.note}>
                        <p>
                          It is a long established fact that a reader will be
                          distracted by the readable content of a page when
                          looking at its layout. The point of using Lorem Ipsum
                          is that it has a more-or-less normal distribution of
                          letters, as opposed to using
                        </p>
                      </div>
                      <h3>Report Job</h3>
                   */}
                      <div className={styles.purpose_cont}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: getJobDetail?.job?.content,
                          }}
                        ></div>
                        <h3
                          onClick={() => {
                            setOpenReportModal(true);
                            setOpen(false);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Report Job
                        </h3>
                      </div>
                    </div>
                  </Typography>
                </Box>
              </Dialog>

              <Dialog
                open={openReportModal}
                onClose={() => setOpenReportModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="jobs_modal"
                scroll={"body"}
              >
                <Box sx={style}>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <h3>Report Job</h3>
                    <div className={styles.messagebox}>
                      <div className={styles.messageformbox}>
                        <textarea
                          name="Message"
                          value={reportText.Message}
                          placeholder="Message"
                          onChange={postUserData}
                          // onChange={(e) => setReportText(e.target.value)}
                        ></textarea>
                      </div>
                      <div
                        className="error"
                        style={{
                          fontSize: "15px",
                          marginBottom: "5px",
                          display: "contents",
                          color: "red",
                        }}
                      >
                        {error.Message}
                      </div>
                      <div className={styles.job_report_submit}>
                        <button
                          onClick={() => reportJobPosts(getJobDetail?.job?._id)}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </Typography>
                </Box>
              </Dialog>
              <Grid item md={6} xs={12}></Grid>
            </Grid>
            {/* <Stack spacing={2}>
              <Pagination
                count={getAllJobsData?.total}
                // onChange={(e, value) =>
                //   // dispatch(
                //   //   getAllJobs({
                //   //     pagination_page: value,
                //   //     pagination_per_page: 5,
                //   //   })
                //   // )
                // }
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Stack> */}
          </Box>
        </div>
      </div>

      {/* Job Details  */}
      <Dialog
        open={open}
        onClose={handleCloseJobDetails}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="jobs_modal"
        scroll={"body"}
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className={styles.modal_cont}>
              <div className={styles.left_cont}>
                {/* <Image
                          src={assets.jobprofileimg}
                          width={106}
                          height={106}
                        /> */}
                <img
                  src={
                    getJobDetail?.user?.profile_image !== null
                      ? `${mediaPath}/uploads/user/profile_pic/${getJobDetail?.user?.profile_image}`
                      : assest.noImage
                  }
                  width={48}
                  height={48}
                  onError={onErrorImg}
                />
                <div className={styles.heading_text}>
                  <h2>
                    {getJobDetail?.job?.title} <Rating />{" "}
                    <span>{getJobDetail?.user?.total_count} Reviews</span>
                  </h2>
                  <p>{getJobDetail?.user?.business_info}</p>
                  <h3>
                    {getJobDetail?.job?.location}{" "}
                    <span>Urgent Requirement</span>
                  </h3>
                  <ul className={styles.listing_sec}>
                    <div className={styles.listing_top_box}>
                      <li>
                        <Image
                          src={assets.jobdetailsicon1}
                          width={14}
                          height={14}
                        />{" "}
                        {moment(getJobDetail?.job?.createdAt).format(
                          "DD MMM YY"
                        )}
                      </li>
                      {/* <li>
                        <Image
                          src={assets.jobdetailsicon2}
                          width={14}
                          height={14}
                        />{" "}
                        19 Expert Required
                      </li> */}
                      <li>
                        <Image
                          src={assets.jobdetailsicon3}
                          width={14}
                          height={14}
                        />{" "}
                        {getJobDetail?.job?.job_type}
                      </li>
                    </div>
                    <div className={styles.listing_top_box}>
                      <li>
                        {getJobDetail?.job?.position ? (
                          <li>
                            <Image
                              src={assets.jobdetailsicon4}
                              width={14}
                              height={14}
                            />{" "}
                            {getJobDetail?.job?.position}
                          </li>
                        ) : null}
                      </li>
                      <li>
                        <Image
                          src={assets.jobdetailsicon5}
                          width={14}
                          height={14}
                        />{" "}
                        ${getJobDetail?.job?.pay_upto} Hourly
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
              <div className={styles.right_cont}>
                <ul>
                  <li>
                    <Image
                      src={
                        getJobDetail?.isFavorite
                          ? assets?.hearticonFill
                          : assets?.hearticon
                      }
                      width={106}
                      height={106}
                      onClick={() => {
                        addToFavoriteJob(getJobDetail?.job?._id);
                        handleCloseJobDetails();
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setOpenApplyModal(true);
                        handleCloseJobDetails();
                        setJobId(getJobDetail?.job?._id);
                      }}
                      disabled={getJobDetail?.isApply}
                      style={getJobDetail?.isApply ? disabled : {}}
                    >
                      {getJobDetail?.isApply ? "Applied" : "Apply now"}
                    </button>
                  </li>
                </ul>
                <p>
                  Job Post :{" "}
                  {moment(getJobDetail?.job?.createdAt).format("DD MMM YYYY")}
                </p>
              </div>
            </div>
            <div className={styles.cont_body}>
              <div className={styles.purpose_cont}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getJobDetail?.job?.content,
                  }}
                ></div>
                <h3
                  onClick={() => {
                    setOpenReportModal(true);
                    setOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Report Job
                </h3>
              </div>
            </div>
          </Typography>
        </Box>
      </Dialog>
      <Dialog
        open={openReportModal}
        onClose={() => setOpenReportModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="jobs_modal"
        scroll={"body"}
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <h3>Report Job</h3>
            <div className={styles.messagebox}>
              <div className={styles.messageformbox}>
                <textarea
                  name="Message"
                  value={reportText.Message}
                  placeholder="Message"
                  onChange={postUserData}
                  // onChange={(e) => setReportText(e.target.value)}
                ></textarea>
              </div>
              <div
                className="error"
                style={{
                  fontSize: "15px",
                  marginBottom: "5px",
                  display: "contents",
                  color: "red",
                }}
              >
                {error.Message}
              </div>
              <div className={styles.job_report_submit}>
                <button onClick={() => reportJobPosts(getJobDetail?.job?._id)}>
                  Submit
                </button>
              </div>
            </div>
          </Typography>
        </Box>
      </Dialog>

      <Dialog
        open={openApplyModal}
        onClose={() => setOpenApplyModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="jobs_modal"
        scroll={"body"}
      >
        <Box sx={style2}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <h3>Apply Job</h3>
            <div className={styles.messagebox}>
              <div className={styles.messageformbox}>
                <h4 style={styleH4}>Are you want to apply this job?</h4>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <button onClick={applyJob}>Continue</button>
                <button
                  onClick={() => setOpenApplyModal(false)}
                  style={CancelBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Typography>
        </Box>
      </Dialog>
      {/* <Dialog
        open={openApplicantModal}
        onClose={() => setOpenApplicantModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="jobmodalmainone"
        scroll={"body"}
      >
        <DialogContent>
          <h2>User Application List</h2>
          <Grid container spacing={2}>
            {applyListOfUser?.data?.length !== 0 ? (
              <>
                {applyListOfUser?.data?.map((item, i) => (
                  <Grid item xs={12} md={6} className="boxone">
                    <Box key={i}>
                      <Typography component={"h3"}>
                        <label>Job Title : </label> {item?.job_info?.title}{" "}
                        {console.log(item, "items")}
                      </Typography>
                      <Typography component={"h3"}>
                        <label>Email : </label> {item?.job_info?.email}
                      </Typography>
                      <Typography component={"h3"}>
                        <label>Phone :</label> {item?.job_info?.phone}
                      </Typography>
                      <Typography component={"h3"}>
                        <label>Position :</label> {item?.job_info?.position}
                      </Typography>
                      <Typography component={"h3"}>
                        <label>Job Type :</label> {item?.job_info?.job_type}
                      </Typography>

                      <Typography component={"h3"}>
                        <label>Category :</label> {item?.category_info?.title}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </>
            ) : (
              <>No application</>
            )}
          </Grid>
        </DialogContent>
      </Dialog> */}
    </DashboardWrapper>
  );
}

export default Index;
