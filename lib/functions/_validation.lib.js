import { emailRegex } from "../regex";

export const checkInputLength = (str, length) => {
  try {
    if (str?.length <= length) {
      return false; // string is valid
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const giveErrorOnEmptyString = (str) => {
  try {
    return str?.length === 0;
  } catch (error) {
    return true;
  }
};

export const checkValidEmail = (email) => {
  try {
    // if valid return true else false
    return emailRegex.test(email);
  } catch (error) {
    return false;
  }
};
