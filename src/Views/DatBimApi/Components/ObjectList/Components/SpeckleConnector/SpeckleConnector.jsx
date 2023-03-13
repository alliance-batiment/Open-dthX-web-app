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
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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
  const containerRef = useRef(HTMLDivElement);
  const viewerRef = useRef(Viewer);


  function createMesh(insertedMeshes) {

  }



  useEffect(() => {
    const init = async () => {
      
      // //1 The scene
      // const scene = new Scene()

      // //2 The Object
      // const geometry = new BoxGeometry(0.5, 0.5, 0.5);
      // const material = new MeshBasicMaterial( {color: 'orange'} );
      // const cubeMesh = new Mesh( geometry, material );
      // scene.add( cubeMesh );

      // //3 The Camera
      // const sizes = {
      //     width: 800,
      //     height: 600,
      // }

      // const camera = new PerspectiveCamera(75, sizes.width/ sizes.height);
      // camera.position.z = 3; // Z let's you move backwards and forwards. X is sideways, Y is upward and do
      // scene.add( camera );

      // //4 The Renderer
      // const threeCanvas= document.getElementById('three-canvas')
      // const renderer = new WebGLRenderer({
      //     canvas: threeCanvas,
      // });

      // renderer.setSize(sizes.width, sizes.height);

      // const loader = new GLTFLoader();
      // const loadedData = await loader.loadAsync(GlbFile);


      // console.log('loadedData', loadedData)
      // console.log('loadedData', loadedData.scene.children[0])
      // const object = loadedData.scene.children[0];
      // scene.add(loadedData.scene.children[0])

      // let geoms = [];
      // let meshes = [];
      // object.traverse( function( o ) {
      //   if ( o.isMesh ) {
      //     console.log( o.geometry )
      //     meshes.push(o);
      //     geoms.push(o.geometry);
      //   };
      // });
      // console.log('MESHES',meshes)
      // //clone.updateMatrixWorld(true,true)
      // //clone.traverse(e=>e.isMesh && meshes.push(e) && (geoms.push(( e.geometry.index ) ? e.geometry.toNonIndexed() : e.geometry().clone())))
      // geoms.forEach((g,i)=>g.applyMatrix4(meshes[i].matrixWorld));
      
      // let gg = BufferGeometryUtils.mergeBufferGeometries(geoms,true)
      // // gg.applyMatrix4(clone.matrix.clone().invert());
      // // gg.userData.materials = meshes.map(m=>m.material)

      // // console.log('gg', gg);

      // const container = document.getElementById('viewer-container');
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

      // console.log('SPECKLE', res.data)

      // const newViewer = new Viewer(container, {
      //    showStats: false,
      //    environmentSrc: '',
      //  });
      //  await newViewer.init();
      //  newViewer.on(ViewerEvent.LoadProgress, (arg) => {
      //   console.log(arg)
      // })
      //  //await newViewer.loadObject(`${hostUrl}/${streamId}/${commitId}`, '6360a3aac1a47d32ddadf4efbe529e3a6fb2669088')
      //  await newViewer.loadObject("https://speckle.xyz/streams/1af93c4201/objects/1e40e9e0b9d011446d02de03e231092d", '7a12985629a662ea4f063920b1b944cc0b80f358ce');
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

  const postGeometry = async (properties, objSelected) => {
    try {
      console.log('properties', properties);
      console.log('objSelected', objSelected);

      const updatedProperties = [];

      for(let property of properties) {
        updatedProperties.push(updatePorperty(property));
      }

      const objectGeometry = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObject}/get-model-file/glb`,
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
        data: updatedProperties,
      });
      console.log("objectGeometry", objectGeometry);
      console.log("type ", typeof objectGeometry.data);
      console.log("instance ", objectGeometry.data instanceof ArrayBuffer);


      // const exporter = new GLTFExporter();
      // exporter.parse(objectGeometry.data, (result) => {
      //   console.log(typeof result);
      //   if (result instanceof ArrayBuffer) {
      //     saveArrayBuffer(result, 'newmodel.glb');
      //   } else {
      //     const output = JSON.stringify(result, null, 2);
      //     saveString(output, 'newmodel.gltf');
      //   }
      // })

      saveString(objectGeometry.data, 'newmodel.gltf');
      // console.log("objectGeometry", objectGeometry);

      // const fileName = `object_${objSelected}_geometry`;
      // const buffer = objectGeometry.data;
      // const blob = new Blob([buffer], { type: 'application/octet-stream' });
      // const href = await URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = href;
      // link.download = fileName + ".glb";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

    } catch (err) {
      console.log('error ', err);
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
      
      let gg = BufferGeometryUtils.mergeBufferGeometries(geoms,true)
      // gg.applyMatrix4(clone.matrix.clone().invert());
      // gg.userData.materials = meshes.map(m=>m.material)

      // console.log('gg', gg);

      console.log('VERTICES', Array.from(gg.attributes.position.array))
      const res = await axios({
        method: "post",
        url: "http://localhost:5000/speckle/postData",
        headers: {
          "content-type": "application/json"
        },
        data: {
          vertices: Array.from(gg.attributes.position.array),
          faces: Array.from(gg.index.array),
          colors: Array.from(gg.attributes.color.array),
          // colors: colors
        }
      })
  }

  return (
    <>
      {loading ?
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <CircularProgress style={{ color: "OrangeRed" }} />
        </Grid>
        :
        <>
          <Grid row align="left">
            <Button
              variant="contained"
              onClick={() => {
                postGeometry(properties, selectedObject);
              }}
              color="primary"
              className={classes.button}
            >
              Géométrie
            </Button>
          </Grid>
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
      <canvas id="three-canvas" style={{width: 400, height: 400, backgroundColor: 'red'}}></canvas>
      <div id="viewer-container" style={{width: 400, height: 400, backgroundColor: 'red'}}></div>
    {/* <iframe src="https://speckle.xyz/embed?stream=5e27173ad3&object=35fd8ddce68a4cae3327b9e43584b609&transparent=true&autoload=true&hidecontrols=true&noscroll=true&hidesidebar=true&hideselectioninfo=true&commentslideshow=true" width="600" height="400" frameborder="0"></iframe> */}
    </>
  );
}

export default SpeckleConnector;