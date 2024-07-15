/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

import themeColors from "@/styles/abstracts/_variable.module.scss";

export default function themePalette() {
  return {
    mode: "light",
    common: {
      black: themeColors?.darkPaper,
      themeColor1: themeColors?.commonThemeColor1,
      themeColor2: themeColors?.commonThemeColor2,
      themeColor3: themeColors?.commonThemeColor3,
      themeColor4: themeColors?.commonThemeColor4,
    },
    primary: {
      light: themeColors?.primaryLight,
      main: themeColors?.primaryMain,
      dark: themeColors?.primaryDark,
      200: themeColors?.primary200,
      800: themeColors?.primary800,
    },
    secondary: {
      light: themeColors?.secondaryLight,
      main: themeColors?.secondaryMain,
      dark: themeColors?.secondaryDark,
      200: themeColors?.secondary200,
      800: themeColors?.secondary800,
    },
    error: {
      light: themeColors?.errorLight,
      main: themeColors?.errorMain,
      dark: themeColors?.errorDark,
    },
    orange: {
      light: themeColors?.orangeLight,
      main: themeColors?.orangeMain,
      dark: themeColors?.orangeDark,
    },
    warning: {
      light: themeColors?.warningLight,
      main: themeColors?.warningMain,
      dark: themeColors?.warningDark,
    },
    success: {
      light: themeColors?.successLight,
      200: themeColors?.success200,
      main: themeColors?.successMain,
      dark: themeColors?.successDark,
    },
    grey: {
      50: themeColors?.grey50,
      100: themeColors?.grey100,
      500: themeColors?.darkTextSecondary,
      600: themeColors?.heading,
      700: themeColors?.darkTextPrimary,
      900: themeColors?.textDark,
    },
    dark: {
      light: themeColors?.darkTextPrimary,
      main: themeColors?.darkLevel1,
      dark: themeColors?.darkLevel2,
      800: themeColors?.darkBackground,
      900: themeColors?.darkPaper,
    },
    text: {
      primary: themeColors?.darkTextPrimary,
      secondary: themeColors?.darkTextSecondary,
      dark: themeColors?.textDark,
      hint: themeColors?.grey100,
    },
    background: {
      paper: themeColors?.paper,
      default: themeColors?.backgroundDefault,
    },
  };
}
