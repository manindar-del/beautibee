// import {
//   decryptData, encryptData,
//   // encryptData
// } from "./_crypto.lib";

/**
 * Check if the window object exists.
 * @returns A function that checks if the window is undefined.
 */
export function checkWindow() {
  return typeof window !== "undefined";
}

/**
 * It takes a key and a value, encrypts the value, and saves it in local storage
 * @param key - The key to store the data under.
 * @param value - The value to be encrypted.
 */
export function saveInLocalStorage(key, value) {
  if (checkWindow()) {
    // let encript_key = encryptData(key);
    // const encriptVal = encryptData(value);

    localStorage.setItem(key, value);
  }
}

/**
 * It gets the data from the local storage, decrypts it, and returns it
 * @param key - The key to store the data in local storage.
 * @returns the decrypted data from the local storage.
 */
export function getFromLocalStorage(key) {
  if (checkWindow()) {
    const getItem = localStorage.getItem(key);
    // console.log(getItem)

    if (getItem !== null && getItem !== undefined) {
      // const __decryptData = decryptData(getItem);
      // console.log(_decryptData)

      return getItem;
    }

    return null;
  }

  return null;
}
