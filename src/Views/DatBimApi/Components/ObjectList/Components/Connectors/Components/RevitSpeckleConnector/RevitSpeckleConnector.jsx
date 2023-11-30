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
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';
import DescriptionIcon from '@material-ui/icons/Description';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useMutation, gql } from '@apollo/client';
import axios from "axios";
import {
  Mesh,
  BufferGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
} from 'three';
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { Message } from '@material-ui/icons';
import SpeckleIcon from "./Img/SpeckleIcon.png"

const useStyles = makeStyles((theme) => ({
  search: {
    margin: theme.spacing(1),
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
    margin: theme.spacing(1),
    // color: "blue",
    // backgroundColor: "white"
  },
  input: {
    margin: theme.spacing(1),
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


const RevitConnector = ({}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const init = async () => {

     

      setLoading(false);
    };
    init();
  }, []);

  const [vertices, setVertices] = useState([]);
  const [faces, setFaces] = useState([]);

  const [propertyListDefault, setPropertyListDefault] = useState([]);

  const [outputCommitUrl, setOutputCommitUrl] = useState("");
  
  const handleSendElements = async () => {
    if (typeof window.CefSharp !== "undefined") {
      setLoading(true);
      await window.CefSharp.BindObjectAsync("connector");
      const url = await window.connector.sendElements();
      setOutputCommitUrl(url);
      setLoading(false);
    }
  }

  const handleCopyCommit = async () => {
    if (outputCommitUrl !== "") {
      // Copy the text inside the text field
      navigator.clipboard.writeText(outputCommitUrl);
    }
  }

  const handleShowCommit = async () => {
    if (outputCommitUrl !== "") {
      window.open(outputCommitUrl, '_blank')
    }
  }

  return (
    <>
      <Grid item xs={12}>
        <Grid item xs={12}>
          {/* <iframe src="https://speckle.xyz/embed?stream=5e27173ad3&object=35fd8ddce68a4cae3327b9e43584b609&transparent=true&autoload=true&hidecontrols=true&noscroll=true&hidesidebar=true&hideselectioninfo=true&commentslideshow=true" width="600" height="400" frameBorder="0"></iframe> */}
              {/* <div className="np-w-full np-h-full np-pointer-events-auto np-bg-pale" ref={containerRef} /> */}
              {/* <div id="viewer-container" style={{width: 400, height: 400}}></div> */}
              </Grid>

        <Button
          variant="contained"
          onClick={handleSendElements}
          color="primary"
          className={classes.button}
          startIcon={<img src={SpeckleIcon} style={{ height: "2em", width: "2em" }} />}
          endIcon={loading && <CircularProgress style={{ color: "White", height: "1em", width: "1em" }} />}
        >
          Send to Speckle
        </Button>

        <Grid item xs={12}>
          {(outputCommitUrl !== "") &&
            <Paper component="form" className={classes.search}>
              <InputBase
                value={outputCommitUrl}
                className={classes.input}
                placeholder={"URL du commit"}
                inputProps={{ "aria-label": "search google maps" }}
              // onChange={(e) => handleSetUrl(e.target.value)}
              // onKeyDown={onKeyDown}
              />
              <ButtonGroup aria-label="search button group" className={classes.iconButton}>
                <Button
                  className={classes.iconButton}
                  onClick={handleCopyCommit}
                >
                  <FileCopyIcon
                    className={classes.iconButton}
                  />
                </Button>
                <Button
                  className={classes.iconButton}
                  onClick={handleShowCommit}
                >
                  <VisibilityIcon
                    className={classes.iconButton}
                  />
                </Button>
              </ButtonGroup>
            </Paper>

          }
      </Grid>
      </Grid>
    </>
  );
}

export default RevitConnector;