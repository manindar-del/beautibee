
import moment from "moment/moment";
export const timeDistance = (date1, date2) => {
  let diffInMilliSeconds = Math.abs(date1 - date2) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  // calculate seconds
  const seconds = Math.floor(diffInMilliSeconds - minutes) % 60;
  diffInMilliSeconds -= seconds * 60;

  let difference = "";
  if (days > 0 && days < 7) {
    difference += days === 1 ? `${days} day ` : `${days} days `;
  }
  if (hours > 0 && days < 7) {
    difference +=
      hours === 0 || hours === 1 ? `${hours} hour ` : `${hours} hours `;
  }
  // if (minutes > 0 && days < 7) {
  //   difference +=
  //     minutes === 0 || hours === 1
  //       ? `${minutes} min`
  //       : `${minutes} min `;
  // }
  // if (seconds > 0 && days < 7) {
  //   difference +=
  //     seconds === 0 || hours === 1
  //       ? `${seconds} seconds`
  //       : `${seconds} seconds`;
  // }
  if (days > 7) {
    return (difference += moment(date1).format("LL"));
  }
  return difference !== "" ? `${difference} ago ` : "Now";
};
