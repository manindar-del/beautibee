import React, { useEffect, useState } from "react";
import styles from "@/styles/service/addtraining.module.scss";
import Image from "next/image";
import assets from "@/json/assest";
import { useRouter } from "next/router";
import {
  useCreateTraining,
  useUpdateTraining,
  GetTrainingDetails,
} from "@/hooks/useTraining";
import assest from "@/json/assest";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { useSnackbar } from "notistack";

function TrainingForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState({});
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [ImageOriginal, setImageOriginal] = useState(null);
  const [VideoOriginal, setVideoOriginal] = useState(null);

  const [inputData, setInputData] = useState({
    title: "",
    content: "",
    phone: "",
    email: "",
    video:"",
  });
  
  const { mutate: createTraining } = useCreateTraining();
  const { mutate: updateTraining } = useUpdateTraining();

  //inputfield onchange function
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
   * It checks if the input fields are empty or not. If they are empty, it will return an error message
   * @returns an object with the keys of title, content, phone, email, image, and video.
   */
  const validation = () => {
    let error = {};
    if (!inputData.title) {
      error.title = "Training Name is required";
    } else if (inputData.title.length >= 20) {
      error.title = "Maximum 20 characters";
    }

    if (!inputData.content) {
      error.content = "Training Details is required";
    } else if (inputData.content.length >= 240) {
      error.content = "Maximum 240 characters";
    }

    if (!inputData.phone) {
      error.phone = "Phone number is required";
    } else if (inputData.phone.length > 10) {
      error.phone = "Maximum 10 characters";
    } else if (inputData.phone.length < 10) {
      error.phone = "minimum 10 characters";
    }
    var array = inputData.phone.split("");
    if (array.indexOf(".") >= 0) {
      error.phone = "Phone number is not a decimal number";
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
    if (!router.query.id) {
      if (!image) {
        error.image = "Image is required";
      }
    }
    if (video === null && inputData.video ==="") {
      error.video = "Video is required";
    }
    return error;
  };

  /**
   * The function is called when the user clicks the submit button. It prevents the default action of the
   * submit button, creates a new FormData object, calls the validation function, sets the error state to
   * the validation function, and if the validation function returns an empty object, it appends the
   * input data to the formData object, and if the image and video state are not null, it appends them to
   * the formData object. If the router query id is not null, it appends the id to the formData object
   * and calls the updateTraining function, otherwise it calls the createTraining function
   */
  const add = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      formData.append("title", inputData.title);
      formData.append("content", inputData.content);
      formData.append("email", inputData.email);
      formData.append("phone", inputData.phone);
      if (image !== null) {
        formData.append("image", image);
      }
      if (video !== null) {
        formData.append("video", video);
      }

      if (router.query.id) {
        formData.append("id", router.query.id);
        updateTraining(formData);
      } else {
        createTraining(formData);
      }
    }
  };

  /* A useEffect hook that is called when the router query id changes. It calls the GetTrainingDetails
function and sets the inputData state to the data returned from the GetTrainingDetails function. It
also sets the ImageOriginal and VideoOriginal state to the image and video returned from the
GetTrainingDetails function. */
  useEffect(() => {
    if (router.query.id) {
      GetTrainingDetails(router.query.id).then((data) => {
        // console.log(data);
        setInputData({
          title: data?.data?.training?.title,
          content: data?.data?.training?.content,
          email: data?.data?.training?.email,
          phone: data?.data?.training?.phone,
          video:data?.data?.training?.video
        });

        setImageOriginal(data?.data?.training?.image);
        setVideoOriginal(data?.data?.training?.video);
      });
    }
  }, [router.query.id]);

  /**
   * It checks if the image size is less than 3MB, if it is, it sets the image to the state, if not, it
   * displays an error message
   */
  const handleImage = (e) => {
    {
      if (e.target.files[0]?.size <= 3000000) {
        setImage(e.target.files[0]);
      } else {
        enqueueSnackbar("Please upload image of proper size.", {
          variant: "error",
        });
      }
    }
  };

  /**
   * If the user selects a file, set the state of the video to the file selected
   */

  const handleVideo = (e) => {
    if (e.target.files[0] && e.target.files[0].type === "video/mp4") {
      setVideo(e.target.files[0]);
    } else {
      enqueueSnackbar("Please upload video of proper type.", {
        variant: "error",
      });
    }
  };

  /**
   * A function that is called when an image fails to load.
   */
  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };

  return (
    <div className={styles.add_jobs}>
      <div className={styles.jobs_input}>
        <label>Training name *</label>
        <input
          type="text"
          name="title"
          onChange={postUserData}
          value={inputData.title}
          placeholder="Enter Training name"
        />
      </div>
      <div className="error">{error.title}</div>
      <div className={styles.jobs_input}>
        <label>Training details *</label>
        <textarea
          name="content"
          onChange={postUserData}
          value={inputData.content}
          placeholder="Enter Training details"
        />
      </div>
      <div className="error">{error.content}</div>
      <div className={styles.jobs_input}>
        <label>Phone Number *</label>
        <input
          type="number"
          name="phone"
          onChange={postUserData}
          value={inputData.phone}
          placeholder="Enter Phone Number"
        />
      </div>
      <div className="error">{error.phone}</div>
      <div className={styles.jobs_input}>
        <label>Email Address *</label>
        <input
          type="email"
          name="email"
          onChange={postUserData}
          value={inputData.email}
          placeholder="Enter Email Address"
        />
      </div>
      <div className="error">{error.email}</div>
      <div className={styles.upload_image}>
        <ul>
          <li>
            <div className={styles.custom_choose_file}>
              <Image src={assets.imageuploadicon} width={30} height={30} />
              {/* image  priview */}

              {image !== "" && image !== undefined && image !== null ? (
                <Image
                  src={URL.createObjectURL(image)}
                  alt="img"
                  width={15}
                  height={15}
                  className="img image_training image_load"
                />
              ) : (
                <img
                  src={
                    ImageOriginal !== null
                      ? `${mediaPath}/uploads/training/Pictures/${ImageOriginal}`
                      : assest.noImage
                  }
                  width={108}
                  height={108}
                  onError={onErrorImg}
                />
              )}
              {/* image  priview */}
              <p>Upload Training Image *</p>
            </div>
            <input
              type="file"
              onChange={handleImage}
              placeholder="Date"
              accept="image/*"
            />
            <div className="error">{error.image}</div>
          </li>

          <li>
            <div className={styles.custom_choose_file}>
              <Image src={assets.imageuploadicon} width={30} height={30} />
              {video !== "" && video !== undefined && video !== null ? (
                <video
                  src={URL.createObjectURL(video)}
                  width={100}
                  height={100}
                  className="video"
                />
              ) : (
                <video
                  src={
                    VideoOriginal !== null
                      ? `${mediaPath}/uploads/training/Videos/${VideoOriginal}`
                      : "No Video"
                  }
                  width={50}
                  height={50}
                  onError={onErrorImg}
                />
              )}

              <p>Upload Training Video *</p>
            </div>
            <input type="file" onChange={handleVideo} placeholder="Date" />
            <div className="error">{error.video}</div>
          </li>
        </ul>
        <button type="button" onClick={add}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default TrainingForm;
