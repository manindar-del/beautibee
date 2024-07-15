import Rating from "@mui/material/Rating";
import React from "react";

function MuiRating(props) {
  const [ratingValue, setRatingValue] = React.useState(2);
  // const ratingChanged = (newRating, newValue) => {
  //   setRatingValue(newValue);
  //    console.log(newValue,"newRating");
  // };

  return (
    <Rating
      count={5}
      //value ={ratingValue}
      onChange={(e) => {
        props.onChangeRating(e.target.value);
      }}
      //max={max}
      // size={24}
      //size={size}
      activeColor="#ffd700"
    />
  );
}

export default MuiRating;
