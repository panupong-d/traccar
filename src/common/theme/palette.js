import { grey, green, indigo } from "@mui/material/colors";

const validatedColor = (color) =>
  /^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null;

export default (server) => ({
  mode: "dark",
  background: {
    default: grey[900],
  },
  primary: {
    main:
      validatedColor(server?.attributes?.colorPrimary) ||
      indigo[200],
  },
  secondary: {
    main:
      validatedColor(server?.attributes?.colorSecondary) ||
      green[200],
  },
  neutral: {
    main: grey[500],
  },
  geometry: {
    main: "#9fa8da", //สีวง
  },
});