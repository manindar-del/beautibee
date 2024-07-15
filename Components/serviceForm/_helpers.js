export const getAddresValue = (dataset, addressLabel) => {
    if (dataset?.length) {
      for (var i = 0; i < dataset.length; i++) {
        for (var j = 0; j < dataset[i]?.types?.length; j++) {
          if (dataset[i].types[j] === addressLabel) {
            return dataset[i].long_name;
          }
        }
      }
    }
  
    return "";
  };


  export const getAddresValues = (dataset, addressLabel) => {
    if (dataset?.length) {
      for (var i = 0; i < dataset.length; i++) {
        for (var j = 0; j < dataset[i]?.types?.length; j++) {
          if (dataset[i].types[j] === addressLabel) {
            return dataset[i].short_name;
          }
        }
      }
    }
  
    return "";
  };