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
import RevitIcon from "./Img/RevitIcon.png"

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


const RevitConnector = ({
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

  const postGeometry = async (properties, objSelected) => {
    try {
      setLoading(true);

      const updatedProperties = [];

      for(let property of properties) {
        updatedProperties.push(updatePorperty(property));
      }

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
      console.log("objectGeometry", objectGeometry);
      console.log("type ", typeof objectGeometry.data);
      console.log("instance ", objectGeometry.data instanceof ArrayBuffer);

      const scene = new Scene();

      const ifcLoader = new IFCLoader();
      await ifcLoader.ifcManager.setWasmPath("../../files/");
      // saveArrayBuffer(objectGeometry.data, 'newmodel.ifc');
      // console.log("objectGeometry", objectGeometry);


      const ifcBlob = new Blob([objectGeometry.data], { type: 'application/octet-stream' });
      console.log('ifcBlob', ifcBlob)
      var ifcFile = new File([ifcBlob], "ifcFile.ifc");
      console.log('ifcFile', ifcFile)
      const ifcURL = URL.createObjectURL(ifcFile);
      console.log('ifcURL', ifcURL)

      const model = await ifcLoader.loadAsync(ifcURL);
      console.log('model', model)
      const allIDs = Array.from(
        new Set(model.geometry.attributes.expressID.array)
      )

      //const scene = new Scene();
      scene.add(model);

      console.log('allIDs', allIDs)
      console.log('model.modelID', model.modelID)
      console.log('model.parent', model.parent)

      const subset = ifcLoader.ifcManager.createSubset({
        modelID: model.modelID,
        ids: allIDs,
        applyBVH: true,
        scene: model.parent,
        removePrevious: true,
        customID: `full-model-subset-${model.modelID}`,
      });
      console.log('subset', subset);
      const elementMesh = await ifcLoader.ifcManager.getSubset(model.modelID, null, `full-model-subset-${model.modelID}`);

      //--------------------------------------------------------------------------------------------------------------------
      // Récupération des Vertices et des Faces de la Mesh à partir de l'IFC:
      //--------------------------------------------------------------------------------------------------------------------
      
      //const vertices = Array.from(elementMesh.geometry.attributes.position.array);
      const newVertices = Array.from(elementMesh.geometry.attributes.position.array);
      setVertices(newVertices);
      console.log('VERTICES', vertices);
      //const faces = Array.from(elementMesh.geometry.index.array);
      const newFaces = Array.from(elementMesh.geometry.index.array);
      setFaces(newFaces);
      console.log('FACES', faces);
      //--------------------------------------------------------------------------------------------------------------------
      // A ajouter: envoi du Maillage à Revit de la même manière qu'avec DEF
      //--------------------------------------------------------------------------------------------------------------------




      //--------------------------------------------------------------------------------------------------------------------
      // Connection à Revit
      //--------------------------------------------------------------------------------------------------------------------
      await window.CefSharp.BindObjectAsync("connector");
      const fileNameExported = await window.connector.createGeometry();
      await window.CefSharp.PostMessage(JSON.stringify({ action: "createGeometry", vertices: newVertices, faces: newFaces}));


      await ifcLoader.ifcManager.dispose();

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
          startIcon={<img src={RevitIcon} style={{height: "2em", width: "2em"}}/>}
          endIcon={loading && <CircularProgress style={{ color: "White", height: "1em", width: "1em" }} />}
        >
          Send to Revit
        </Button>
      </Grid>
    </>
  );
}

export default RevitConnector;