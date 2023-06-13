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

import GlbFile from "./Flamingo.glb";
import IfcFile from "./newmodel.ifc";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
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
import SpeckleIcon from "./Img/SpeckleIcon.png"

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


const SpeckleConnector = ({
  selectedObject,
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
  const [status, setStatus] = useState("");
  const containerRef = useRef(HTMLDivElement);
  const viewerRef = useRef(Viewer);

  useEffect(() => {
    const init = async () => {
      setLoading(false);
    };
    init();
  }, []);


  const handleSetUrl = (input) => {
    setCommitUrl(input);
    setOutputCommitUrl("");
  }


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
    if(outputCommitUrl !== "") {
      // Copy the text inside the text field
      navigator.clipboard.writeText(outputCommitUrl);
    }
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


      console.log("IfcFile", IfcFile)
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
      // Connection à Speckle
      //--------------------------------------------------------------------------------------------------------------------
      const res = await axios({
        method: "post",
        url: "http://localhost:5000/speckle/postData",
        headers: {
          "content-type": "application/json"
        },
        data: {
          vertices: Array.from(elementMesh.geometry.attributes.position.array),
          faces: Array.from(elementMesh.geometry.index.array),
          colors: Array.from(elementMesh.geometry.index.array)
        }
      });

      console.log('url', res.data)
      const commitUrl = res.data;
      setOutputCommitUrl(commitUrl);
      // window.open(commitUrl, '_blank').focus();


      await ifcLoader.ifcManager.dispose();

      setLoading(false);
    } catch (err) {
      setOutputCommitUrl("");
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

  const getMeshFromFile = async () => {
      const loader = new GLTFLoader();
      const loadedData = await loader.loadAsync(GlbFile);


      // console.log('loadedData', loadedData)
      // console.log('loadedData', loadedData.scene.children[0])
      const object = loadedData.scene.children[0];
      // scene.add(loadedData.scene.children[0])

      let geoms = [];
      let meshes = [];
      object.traverse( function( o ) {
        if ( o.isMesh ) {
          console.log( o.geometry )
          meshes.push(o);
          geoms.push(o.geometry);
        };
      });
      console.log('MESHES',meshes)
      //clone.updateMatrixWorld(true,true)
      //clone.traverse(e=>e.isMesh && meshes.push(e) && (geoms.push(( e.geometry.index ) ? e.geometry.toNonIndexed() : e.geometry().clone())))
      geoms.forEach((g,i)=>g.applyMatrix4(meshes[i].matrixWorld));
      
      // let gg = BufferGeometryUtils.mergeBufferGeometries(geoms,true)
      // gg.applyMatrix4(clone.matrix.clone().invert());
      // gg.userData.materials = meshes.map(m=>m.material)

      // console.log('gg', gg);

      // console.log('VERTICES', Array.from(gg.attributes.position.array))
      // const res = await axios({
      //   method: "post",
      //   url: "http://localhost:5000/speckle/postData",
      //   headers: {
      //     "content-type": "application/json"
      //   },
      //   data: {
      //     vertices: Array.from(gg.attributes.position.array),
      //     faces: Array.from(gg.index.array),
      //     colors: Array.from(gg.attributes.color.array),
      //     // colors: colors
      //   }
      // })
  }

  const handleCreateGeometry = async () =>{
    try{
      //setLoading(true);
      alert('vertices from handleCreatGeometry : '+vertices);
      alert('faces from handleCreatGeometry : '+faces);
      await window.CefSharp.BindObjectAsync("connector");
      const fileNameExported = await window.connector.creatGeometry();
      await window.CefSharp.PostMessage(JSON.stringify({ action: "creatGeometry", vertices: vertices, faces: faces}));
      //setLoading(false);
    }catch (err) {
      console.log({ "Error when saving elements": err });
    }
  }

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
          startIcon={<img src={SpeckleIcon} style={{height: "2em", width: "2em"}}/>}
          endIcon={loading && <CircularProgress style={{ color: "White", height: "1em", width: "1em" }} />}
        >
          Send to Speckle
        </Button>
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
      {/* {loading ?
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <CircularProgress style={{ color: "OrangeRed" }} />
        </Grid>
        :
        <>
          <Grid item xs={12}>
            <Typography variant="subtitle1" component="h3">
            opendthX - Speckle: URL du Commit pour l'enrichissement
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
          <Grid item xs={12} style={{textAlign: "center"}}>
            <iframe src={`${host}/embed?stream=${stream}&commit=${commit}&transparent=true&autoload=true&hidecontrols=true&noscroll=true&hidesidebar=true&hideselectioninfo=true&commentslideshow=true`} width="600" height="400" frameborder="0"></iframe>
          </Grid>
          }
          <Button
          variant="contained"
            onClick={handleUpdateElements}
            color="primary"
          >
            Enrichissement
          </Button>
        </>
      }*/}
      {/* <input type="file" id="file-input" accept=".ifc, .ifcXML, .ifcZIP"></input>
      <canvas id="three-canvas" style={{width: 400, height: 400, backgroundColor: 'red'}}></canvas>
      <div id="viewer-container" style={{width: 400, height: 400, backgroundColor: 'red'}}></div> */}
    {/* <iframe src="https://speckle.xyz/embed?stream=5e27173ad3&object=35fd8ddce68a4cae3327b9e43584b609&transparent=true&autoload=true&hidecontrols=true&noscroll=true&hidesidebar=true&hideselectioninfo=true&commentslideshow=true" width="600" height="400" frameborder="0"></iframe> */}
    </>
  );
}

export default SpeckleConnector;