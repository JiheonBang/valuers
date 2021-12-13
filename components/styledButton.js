import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import ButtonBase from "@mui/material/ButtonBase";

export const OutlinedButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: "3vmin",
  padding: "1vmin 2vmin",
  border: "1px solid",
  lineHeight: 1.5,
  borderColor: "#5254F3",
  color: "#5254F3",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: "#5E5FF5",
    borderColor: "#5E5FF5",
    color: "white",
    boxShadow: "none",
  },
});

export const ContainedButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: "130%",
  padding: "1vmin 2.5vmin",
  lineHeight: 1.5,
  backgroundColor: "#5254F3",
  border: "1px solid",
  color: "white",
  fontWeight: "300",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: "#C6C2FF",
    borderColor: "#C6C2FF",
    color: "white",
    boxShadow: "none",
  },
});

export const TextButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: "130%",
  padding: "1vmin 2.5vmin",
  lineHeight: 1.5,
  color: "black",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: "white",
    color: "#C6C2FF",
    boxShadow: "none",
  },
});

export const PersonaButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: "2.5vmin",
  padding: "1vmin 2.5vmin",
  lineHeight: 1.5,
  color: "black",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
});

export const PersonaButton2 = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: "150%",
  width: "0px",
  lineHeight: 1.5,
  color: "black",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
});

export const ContainedLoadingButton = styled(LoadingButton)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: "2.5vmin",
  padding: "1vmin 2.5vmin",
  lineHeight: 1.5,
  backgroundColor: "#5254F3",
  border: "1px solid",
  color: "white",
  fontWeight: "300",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: "#C6C2FF",
    borderColor: "#C6C2FF",
    color: "white",
    boxShadow: "none",
  },
});

export const ExploreButtonBase = styled(ButtonBase)({
  width: "100%",
  height: "100%",
  margin: 0,
  borderRadius: "10px",
  boxShadow: "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 300ms ease-in-out, transform 300ms ease-in-out",
  "&:hover": {
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 4px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
  },
});
