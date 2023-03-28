import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from "@material-ui/core";
import {
  Grid,
  TextField,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Input,
  Typography,
  CircularProgress,
  Collapse,
  IconButton,
  InputBase,
  ButtonGroup
} from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
  search: {
    margin:theme.spacing(1),
    // height: "3em",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    // width: "100%",
    color: "blue",
    // marginBotton: "2em",
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
  button: {
    margin:theme.spacing(1),
    // color: "blue",
    // backgroundColor: "white"
  },
  input: {
    margin:theme.spacing(1),
    color: "blue",
    flex: 1,
  },
  iconButton: {
    borderWidth: "0px",
    border: "none",
    backgroundColor: "transparent",
    color: "black",
    // "&:hover": {
    //   backgroundColor: "#E6464D",
    //   color: "white",
    // },
    // "&:disabled": {
    //   border: "none",
    // },
  },
}));


const Connectors = ({
  selectedObject,
  properties,
  setProperties
}) => {
  const classes = useStyles();

  useEffect(() => {
    const init = async () => {
    };
    init();
  }, []);



  return (
    <Paper>
        HELLO
    </Paper>
  );
}

export default Connectors;