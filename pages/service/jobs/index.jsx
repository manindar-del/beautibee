import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useState, useEffect } from "react";
import styles from "@/styles/service/jobs.module.scss";
import Image from "next/image";
import assets from "@/json/assest";
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
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import assest from "@/json/assest";
import { useRouter } from "next/router";
import { useGetAllJobs, GetDeleteJob, useGetApplyList } from "@/hooks/useJobs";
import { Button, IconButton } from "@mui/material";
import { timeDistance } from "@/lib/functions/_time.lib";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { styled, alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "react-query";
import { Cookies } from "react-cookie";
import MuiRating from "@/components/Rating/Rating";
import moment from "moment/moment";
import {
  getJobsDetails,
  addToFavJobs,
  reportJobPost,
  getAllJobs,
  getApplyList,
} from "@/reduxtoolkit/jobs.slice";
import { useSnackbar } from "notistack";
import { notiStackType } from "@/json/notiJson/notiJson";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Groups3Icon from "@mui/icons-material/Groups3";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const cookie = new Cookies();
  const dispatch = useDispatch();
  let userDetails = cookie.get("userDetails");
  const [openJobDetails, setOpenJobDetails] = useState(false);
  const handleCloseStudioDetails = () => setOpenJobDetails(false);
  const [values, setValues] = React.useState(0);
  const [openApplicantModal, setOpenApplicantModal] = useState(false);
  const ratingChanged = (newValue) => {
    setValues(newValue);
  };
  const {
    data,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetAllJobs();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [jobId, setJobId] = useState(null);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const [openReportModal, setOpenReportModal] = useState(false);
  const [reportText, setReportText] = useState({
    Message: "",
  });
  const [error, setError] = useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCloseJobDetails = () => setOpen(false);

  // const { data: allApplyList } = useGetApplyList({
  //   // job_id: jobId,
  //   pagination_page: 1,
  //   pagination_per_page: 10,
  // });

  //inputfield onchange function
  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setReportText({ ...reportText, [name]: value });
  };

  const { getJobDetail, allApplyList } = useSelector((store) => store.jobs);

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
   * This function is used to open the job details modal
   */
  const handleOpenJobDetails = (id, userID) => {
    let data = {
      id: id,
      userID: userID,
    };
    setOpen(true);
    dispatch(getJobsDetails(data));
  };

  /**
   * The validation function is used to validate the form fields
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
   * A function that is called when an image fails to load.
   */
  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };

  const { mutate: deleteJob } = useMutation("job", (variables) =>
    GetDeleteJob(variables)
  );

  /**
   * It deletes a job from the database.
   */
  const deleteToItem = (id) => {
    if (id) {
      deleteJob(id, {
        onSuccess: () => {
          enqueueSnackbar("Job successfully deleted", notiStackType.success);
          refetch();
        },
      });
    } else {
      enqueueSnackbar("Something Wrong", notiStackType.error);
    }
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
    dispatch(
      getApplyList({
        job_id: id,
        pagination_page: 1,
        pagination_per_page: 10,
      })
    );
  };

  /**
   * We take a string, lowercase it, split it into an array of words, capitalize the first letter of
   * each word, and then join the array back into a string
   * @returns The function capitalizeWords() takes a string as an argument and returns the string with
   * the first letter of each word capitalized.
   */
  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <DashboardWrapper headerType="search" page="service">
      <Container>
        <div className={styles.jobs_wrapper}>
          <div className={styles.heading_top}>
            <h3
              className="headingH3 pointerBtn"
              onClick={() => router.push("/service/dashboard")}
            >
              <KeyboardBackspaceIcon /> Dashboard
            </h3>
            <button onClick={() => router.push("/service/jobs/create")}>
              Add Job +
            </button>
          </div>

          <div
            className={styles.jobs_full_wrapper}
            style={{
              width: "100%",
              height: hasNextPage ? "700px" : "800px",
              overflow: "auto",
            }}
          >
            {data?.pages[0]?.data?.length > 0 ? (
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  {data?.pages?.length > 0 &&
                    data?.pages?.map((data) => {
                      let item = data?.data?.map((item, i) => (
                        <Grid item md={4} sm={6} xs={12} key={i}>
                          <div className={styles.jobs_box}>
                            <h3
                              onClick={() =>
                                handleOpenJobDetails(
                                  item?._id,
                                  userDetails?.data?._id
                                )
                              }
                            >
                              {capitalizeWords(item?.title)}
                            </h3>
                            <div className={styles.jobs_box_ul}>
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
                                <li style={{ fontSize: "10px" }}>
                                  {timeDistance(
                                    new Date(item?.createdAt).getTime(),
                                    new Date().getTime()
                                  )}
                                </li>
                                <li>
                                  <span>{item?.user_info?.email}</span>
                                </li>
                              </ul>
                            </div>
                            <div className={styles.jobs_profile}>
                              {item?.user_info?.business_image !== null ? (
                                <img
                                  src={`${mediaPath}/uploads/user/business_image/${item?.user_info?.business_image}`}
                                  width={115}
                                  height={153}
                                  onError={onErrorImg}
                                />
                              ) : (
                                <Image
                                  src={assets.noImage}
                                  alt="img"
                                  width={111}
                                  height={43}
                                />
                              )}
                              {/* <img
                                src={
                                  item?.user_info !== null
                                    ? `${mediaPath}/uploads/user/business_image/${item?.user_info?.business_image}`
                                    : assest.noImage
                                }
                                width={48}
                                height={48}
                              /> */}
                              <h5>{capitalizeWords(item?.company)}</h5>
                            </div>
                            <div className={styles.jobs_link}>
                              <ul>
                                <li>
                                  <Link href="">
                                    <Image
                                      src={"/assets/images/location_icon.svg"}
                                      width={16}
                                      height={16}
                                    />
                                    <span>{item?.location}</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link href="">
                                    <Image
                                      src={"/assets/images/clock_icon.svg"}
                                      width={16}
                                      height={16}
                                    />
                                    <span>{item?.job_type}</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link href="">
                                    $
                                    <span>
                                      {Number(item?.pay_upto)?.toLocaleString()}
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className={styles.bottom_bar}>
                              <p>
                                {item?.job_apply_count} Latest applications
                                received
                              </p>
                            </div>

                            <IconButton
                              className={styles.jobs_heart}
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
                            </IconButton>
                            <Menu
                              className="menu_listing"
                              id={`demo-customized-menu-${item._id}`}
                              MenuListProps={{
                                "aria-labelledby": `demo-customized-menu-${item._id}`,
                              }}
                              anchorEl={anchorEl}
                              open={
                                menuId === item._id && openMenu ? true : false
                              }
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
                                View applicant's
                              </MenuItem>
                              <Divider sx={{ my: 0.5 }} />

                              <MenuItem
                                onClick={() =>
                                  router.push(`/service/jobs/edit/${item._id}`)
                                }
                              >
                                <EditIcon />
                                Edit
                              </MenuItem>
                              <Divider sx={{ my: 0.5 }} />

                              <MenuItem
                                onClick={() => deleteToItem(item?._id)}
                                sx={{ color: "red" }}
                              >
                                <DeleteIcon />
                                Delete
                              </MenuItem>

                              <Box className="close_button">
                                {/* <CloseIcon /> */}
                              </Box>
                            </Menu>
                          </div>
                        </Grid>
                      ));
                      return item;
                    })}
                  <Grid item md={6} xs={12}></Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ display: "flex" }}>
                <h1 style={{ textAlign: "center", width: "100%" }}>
                  No Job available
                </h1>
              </Box>
            )}
          </div>
        </div>
        <Modal
          open={open}
          onClose={handleCloseJobDetails}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="jobmodalmaintwo"
          scroll={"body"}
        >
          <Box sx={style}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <div className={styles.modal_cont}>
                <div className={styles.left_cont}>
                  <img
                    src={
                      getJobDetail?.user?.profile_image !== null
                        ? `${mediaPath}/uploads/user/business_image/${getJobDetail?.user?.business_image}`
                        : assest.noImage
                    }
                    width={48}
                    height={48}
                    onError={onErrorImg}
                  />
                  <div className="job_details">
                    <h2>{getJobDetail?.job?.title} </h2>
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
                          {moment(getJobDetail?.job?.end_date).format(
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
                          <Image
                            src={assets.jobdetailsicon4}
                            width={14}
                            height={14}
                          />{" "}
                          {getJobDetail?.job?.position}
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
                  <p>
                    Job Post :{" "}
                    {moment(getJobDetail?.job?.createdAt).format("DD MMM YYYY")}
                  </p>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: getJobDetail?.job?.content,
                }}
              ></div>
            </Typography>
          </Box>
        </Modal>

        <Dialog
          open={openApplicantModal}
          onClose={() => setOpenApplicantModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          // className="job_modal"
          className="jobmodalmainone"
          scroll={"body"}
        >
          <DialogContent>
            <h2>Applicant's List</h2>
            <Grid container spacing={2}>
              {allApplyList?.length !== 0 ? (
                <>
                  {allApplyList?.map((item, i) => (
                    <Grid item xs={12} md={6} className="boxone">
                      <Box key={i}>
                        <Typography component={"h3"}>
                          <label>Name : </label>{" "}
                          {item?.apply_user_info?.full_name}{" "}
                        </Typography>
                        <Typography component={"h3"}>
                          <label>Email : </label> {item?.apply_user_info?.email}
                        </Typography>
                        <Typography component={"h3"}>
                          <label>Phone :</label> {item?.apply_user_info?.phone}
                        </Typography>
                        <Typography component={"h3"}>
                          <label>Category :</label> {item?.category_info?.title}
                        </Typography>
                        {/* <Typography component={"h3"}>
                          <label>Business name :</label>{" "}
                          {item?.technician_user_info?.business_name}
                        </Typography> */}
                      </Box>
                    </Grid>
                  ))}
                </>
              ) : (
                <>No applicant</>
              )}
            </Grid>
          </DialogContent>
        </Dialog>
        {hasNextPage && !isFetchingNextPage && (
          <button
            className={styles.loadmore}
            onClick={() => {
              fetchNextPage();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            View more
          </button>
        )}
      </Container>
    </DashboardWrapper>
  );
}

export default Index;
