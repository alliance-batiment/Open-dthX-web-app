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
// import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// import { BufferGeometryUtils } from 'three/addons/utils/BufferGeometryUtils.js';
import { IFCLoader } from "web-ifc-three/IFCLoader";
import IFCIcon from "./Img/IFCIcon.png"

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


const IfcConnector = ({
  selectedObject,
  properties,
  setProperties
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");


  useEffect(() => {
    const init = async () => {
      setLoading(false);
    };
    init();
  }, []);



  const updatePorperty = (property) => {
    switch (property.data_type_name) {
      case "Intervalle":
        return {
          ...property,
          text_value: property.num_value,
          value: property.num_value
        }
      case "Grid/Tableau":
        const { values } = JSON.parse(property.text_value)
        const newValues = [];
        for (let value of values) {
          newValues.push(`${value[0].data}: ${value[1].data}`)
        }
        return {
          ...property,
          text_value: newValues.toString(),
          value: newValues.toString(),
        }
      default:
        return {
          ...property,
          value: property.text_value
        };
    }
  }

  const [vertices, setVertices] = useState([]);
  const [faces, setFaces] = useState([]);

  const [propertyListDefault, setPropertyListDefault] = useState([]);

  const postGeometry = async (properties, objSelected) => {
    try {
      setLoading(true);

      const updatedProperties = [];

      for (let property of properties) {
        updatedProperties.push(updatePorperty(property));
      }
      console.log('updatedProperties', updatedProperties)
      const signingProperties = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_DATBIM}/objects/${objSelected}/signing`,
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
        data: updatedProperties,
      });

      const objectGeometry = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_DATBIM}/objects/${objSelected}/get-model-file/ifc`,
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": sessionStorage.getItem("token"),
          "Accept": "application/octet-stream",
        },
        data: updatedProperties,
      });

      console.log(objectGeometry.data)

      saveArrayBuffer(objectGeometry.data, `${objSelected}.ifc`);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      getError(err);
    }
  };

  const getError = (err) => {
    if (err.response?.status === 400) {
      setStatus("the data sent is not correct")
    }
    if (err.response?.status === 401) {
      setStatus("unauthorized, the token must be in the header")
    }
    if (err.response?.status === 403) {
      setStatus("access denied")
    }
    if (err.response?.status === 404) {
      setStatus("the object id doesn't exist")
    }
    if (err.response?.status === 410) {
      setStatus("resource unavailable")
    }
  };

  const saveString = (text, filename) => {
    save(new Blob([text], { type: 'text/plain' }), filename);
  };

  const saveArrayBuffer = (buffer, filename) => {
    save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
  };

  const save = (blob, filename) => {
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };


  return (
    <>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={() => {
            postGeometry(properties, selectedObject);
          }}
          color="primary"
          className={classes.button}
          startIcon={<img src={IFCIcon} style={{ height: "2em", width: "2em" }} />}
          endIcon={loading && <CircularProgress style={{ color: "White", height: "1em", width: "1em" }} />}
        >
          Get IFC
        </Button>
      </Grid>
    </>
  );
}

export default IfcConnector;