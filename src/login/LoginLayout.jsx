import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useTheme } from "@mui/material/styles";
import LogoImage from "./LogoImage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url(/background.jpg)",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    // backgroundColor: theme.palette.primary.main,
    overflow: "hidden",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(5),
    boxShadow: "0px 4px 16px rgb(255, 255, 255)",
    backgroundColor: "rgba(0, 0, 0, 0.84)", // แก้ไขตรงนี้
    borderRadius: "8px",
    width: "100%",
    maxWidth: "480px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "400px",
  },
  logo: {
    marginBottom: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(4),
  },
  form: {
    width: "100%",
  },
}));

const LoginLayout = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <main className={classes.root}>
      <Paper className={classes.paper}>
        <Box className={classes.logo}>
          <LogoImage color={theme.palette.primary.main} />
        </Box>

        <form className={classes.form}>{children}</form>
      </Paper>
    </main>
  );
};

export default LoginLayout;
