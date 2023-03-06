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

import { Viewer, DefaultViewerParams, ViewerEvent } from '@speckle/viewer';
import { useMutation, gql } from '@apollo/client';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  search: {
    height: "3em",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    color: "blue",
    // marginBotton: "2em",
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
  input: {
    marginLeft: theme.spacing(1),
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


const SpeckleConnector = ({
  properties,
  setProperties
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [commitUrl, setCommitUrl] = useState("");
  const [outputCommitUrl, setOutputCommitUrl] = useState("");
  const [viewer, setViewer] = useState({});
  const [host, setHost] = useState("");
  const [stream, setStream] = useState("");
  const [commit, setCommit] = useState("");
  const containerRef = useRef(HTMLDivElement);
  const viewerRef = useRef(Viewer);

  useEffect(() => {
    const init = async () => {
      setLoading(false)
      // const container = document.getElementById('viewer-container');
      // const newViewer = new Viewer(container, {
      //    showStats: false,
      //    environmentSrc: '',
      //  });
      //  await newViewer.init();
       //await viewer.loadObject(`${hostUrl}/${streamId}/${commitId}`, '6360a3aac1a47d32ddadf4efbe529e3a6fb2669088')
       //await newViewer.loadObject("https://speckle.xyz/streams/1af93c4201/objects/1e40e9e0b9d011446d02de03e231092d", '7a12985629a662ea4f063920b1b944cc0b80f358ce');
      //  console.log('newViewer', newViewer)
      //  setViewer(newViewer);
      setLoading(false)
    };
    init();
  }, []);


  const handleSetUrl = (input) => {
    setCommitUrl(input);
    setOutputCommitUrl("");
  }

  // const CREATE_LINK_MUTATION = gql`
  //   mutation PostMutation(
  //     $description: String!
  //     $url: String!
  //   ) {
  //     post(description: $description, url: $url) {
  //       id
  //       createdAt
  //       url
  //       description
  //     }
  //   }
  // `;

  // const [createLink] = useMutation(CREATE_LINK_MUTATION, {
  //   variables: {
  //     description: formState.description,
  //     url: formState.url
  //   }
  // });

  const handleUpdateElements = async () => {
    // createLink();
  }

  const handleGetCommit = async () => {
    if(commitUrl !== "") {
      setLoading(true);
      const hostUrl =  commitUrl.split('/streams/')[0]? commitUrl.split('/streams/')[0] : "";
      console.log('hostUrl', hostUrl);
      setHost(hostUrl);
      const streamId =  commitUrl.split('/streams/')[1]?.split('/commits/')[0]? commitUrl.split('/streams/')[1].split('/commits/')[0]: "";
      console.log('streamId', streamId)
      setStream(streamId);
      const commitId =  commitUrl.split('/commits/')[1]?commitUrl.split('/commits/')[1]: "";
      console.log('commitId', commitId)
      setCommit(commitId);
      //await viewer.loadObject(`${hostUrl}/${streamId}/${commitId}`, '6360a3aac1a47d32ddadf4efbe529e3a6fb2669088')
      // https://speckle.xyz/streams/0a3cbc6314/commits/427eebbc8c
      setLoading(false);
    }
  }

  const handlePushCommit = async () => {
    if(properties.length > 0) {
      console.log('properties', properties)
      if (host !== "" && stream !== "" && commit !== "") {
        try {
          setLoading(true);
          const res = await axios({
            method: "post",
            url: "http://localhost:5000/speckle/sendData",
            headers: {
              "content-type": "application/json"
            },
            data: {
              // commitUrl: `${host}/streams/${stream}/commits/${commit}`,
              host,
              stream,
              commit,
              properties
            },
          });
          console.log(res.data)

          setOutputCommitUrl(res.data);
          setLoading(false);
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  const handleCopyCommit = async () => {

  }

  const handleShowCommit = async () => {
    if(outputCommitUrl !== "") {
      window.open(outputCommitUrl,'_blank')
    }
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.value.length === 0) {
        e.preventDefault();
      } else {
        e.preventDefault();
        handleGetCommit();
      }
    }
  };


  return (
    <>
      {loading ?
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <CircularProgress style={{ color: "OrangeRed" }} />
        </Grid>
        :
        <>
          <Grid item xs={12}>
            <Typography variant="subtitle1" component="h3">
            Open dthX - Speckle: URL du Commit pour l'enrichissement
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper component="form" className={classes.search}>
              <InputBase
                value={commitUrl}
                className={classes.input}
                placeholder={"Input URL du commit"}
                inputProps={{ "aria-label": "search google maps" }}
                onChange={(e) => handleSetUrl(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <ButtonGroup aria-label="search button group" className={classes.iconButton}>
              {!(host !== "" && stream !== "" && commit !== "") ?
                <Button
                  className={classes.iconButton}
                  onClick={handleGetCommit}
                >
                  <GetAppIcon
                    className={classes.iconButton}
                  />
                </Button>
                :
                <Button
                  className={classes.iconButton}
                  onClick={handlePushCommit}
                >
                  <PublishIcon
                    className={classes.iconButton}
                  />
                </Button>
              }
              </ButtonGroup>
            </Paper>
          </Grid>
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
          {(host !== "" && stream !== "" && commit !== "") &&
          // <iframe src={`${host}/${stream}/${commit}}`} width="600" height="400" frameborder="0"></iframe>
          <Grid item xs={12} style={{textAlign: "center"}}>
            <iframe src={`${host}/embed?stream=${stream}&commit=${commit}&transparent=true&autoload=true&hidecontrols=true&noscroll=true&hidesidebar=true&hideselectioninfo=true&commentslideshow=true`} width="600" height="400" frameborder="0"></iframe>
          </Grid>
          // <div id="viewer-container" style={{width: 400, height: 400}}></div>
          }
          {/* <div id="viewer-container" style={{width: 400, height: 400}}></div> */}
        {/* <div className="np-w-full np-h-full np-pointer-events-auto np-bg-pale" ref={containerRef} /> */}
          <Button
          variant="contained"
            onClick={handleUpdateElements}
            color="primary"
          >
            Enrichissement
          </Button>
        </>
      }
    {/* <iframe src="https://speckle.xyz/embed?stream=5e27173ad3&object=35fd8ddce68a4cae3327b9e43584b609&transparent=true&autoload=true&hidecontrols=true&noscroll=true&hidesidebar=true&hideselectioninfo=true&commentslideshow=true" width="600" height="400" frameborder="0"></iframe> */}
    </>
  );
}

export default SpeckleConnector;