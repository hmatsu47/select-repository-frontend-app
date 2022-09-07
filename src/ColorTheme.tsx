import { blue, purple } from "@suid/material/colors";
import { createTheme } from "@suid/material/styles";

export const ColorTheme = createTheme({
  palette: {
    primary: {
      main: localStorage.getItem("primaryColor")
        ? (localStorage.getItem("primaryColor") as string)
        : blue[700],
    },
    secondary: {
      main: localStorage.getItem("secondaryColor")
        ? (localStorage.getItem("secondaryColor") as string)
        : purple[500],
    },
  },
});
