import axios from "axios";
import fileDownload from "js-file-download";
import moment from "moment";

export const handleDownload = (url, filename) => {
  axios
    .get(url, {
      responseType: "blob",
    })
    .then((res) => {
      fileDownload(res.data, filename);
    });
};

export const getChatDate = (date) => {
  if (moment().subtract(1, "days").format("YYYY-MM-DD") == date) {
    return "Yesterday";
  } else if (moment().subtract(0, "days").format("YYYY-MM-DD") == date) {
    return "Today";
  } else {
    return moment(date).format("dddd, MMMM DD");
  }
};
export const getChatIndDate = (date) => {
  if (moment().subtract(1, "days").format("YYYY-MM-DD") == date) {
    return "Yesterday";
  } else if (moment().subtract(0, "days").format("YYYY-MM-DD") == date) {
    return "Today";
  } else {
    return moment(date).format("dddd");
  }
};
export const getChatTime = (time) => {
  var stillUtc = moment.utc(time).toDate();
  var local = moment(stillUtc).local().format("HH:mm a");
  return local;
};
