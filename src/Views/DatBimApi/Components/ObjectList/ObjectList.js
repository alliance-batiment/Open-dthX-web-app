import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  makeStyles,
  Grid,
  CircularProgress,
  Typography,
  Breadcrumbs,
  Divider,
  Tabs,
  Tab,
  Box,
  AppBar,
  Paper
} from "@material-ui/core";
import SelectionComponent from "./SelectionComponent";

import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import SearchBar from "../../../../Components/SearchBar";

import PropertyList from "./Components/PropertyList/PropertyList";
import Connectors from "./Components/Connectors";
import RevitConnector from "../ObjectList/Components/Connectors/Components/RevitConnector/RevitConnector";
import IfcConnector from "../ObjectList/Components/Connectors/Components/IfcConnector/IfcConnector";
import SpeckleConnector from "../ObjectList/Components/Connectors/Components/SpeckleConnector";
import RevitSpeckleConnector from "../ObjectList/Components/Connectors/Components/RevitSpeckleConnector/RevitSpeckleConnector";

const useStyles = makeStyles((theme) => ({
  link: {
    color: "inherit",
    "&:hover": {
      color: "textPrimary",
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
  button: {
    backgroundColor: "#E6464D",
    color: "white",
    "&:hover": {
      backgroundColor: "#E6464D",
      color: "white",
    },
    "&:disabled": {
      opacity: 0.8,
      color: "white",
    },
  },
}));

const ObjectList = ({
  bimData,
  setBimData,
  projectId,
  objSelected,
  addElementsNewProperties,
  selectedObject,
  selectedObjectSet,
  setSelectedObject,
  viewer,
  modelID,
  eids,
  setEids,
  breadcrumbMap,
  handleShowMarketplace,
  setActiveStep,
  selectedPortal
}) => {
  const classes = useStyles();

  const [searchBarInput, setSearchBarInput] = useState("");
  const [selectors, setSelectors] = useState([]);
  const [selectorsRequest, setSelectorsRequest] = useState([]);
  const [selectorsLoader, setSelectorsLoader] = useState(false);
  const [objectsLoader, setObjectsLoader] = useState(false);
  const [objectGeometry, setObjectGeometry] = useState(false);
  const [objectListing, setObjectListing] = useState({});
  const [selectedObjectName, setSelectedObjectName] = useState("");
  const [properties, setProperties] = useState([]);
  const [value, setValue] = useState(0);
  const [isLastLevel, setIsLastLevel] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const classes = await axios.get(
  //   `${process.env.REACT_APP_API_DATBIM}/classes/mapping/${typeProperties}`,
  //   {
  //     headers: {
  //       "content-type": "application/json",
  //       "X-Auth-Token": sessionStorage.getItem("token"),
  //     },
  //   }
  // );

  useEffect(() => {
    getSelectorsOfObjectSet();
    getObjectsOfSelectedObject();
  }, []);

  const getSelectorsOfObjectSet = async () => {
    try {
      setSelectorsLoader(true);
      const selectorsOfObjectSet = await axios.get(
        `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObjectSet}/get-selector`,
        {
          headers: {
            "content-type": "application/json",
            "X-Auth-Token": sessionStorage.getItem("token"),
          },
        }
      );

      console.log("selectorsOfObjectSet.data", selectorsOfObjectSet.data);
      setSelectors(selectorsOfObjectSet.data);
      setSelectorsLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getObjectsOfAdvancedSearch = async (selectorsRequest) => {
    try {
      setSelectorsLoader(true);
      setObjectsLoader(true);
      // console.log("selectorsRequest ==>", selectorsRequest);
      const objectsOfAdvancedSearch = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObjectSet}/search-on-selector?tree=1`,
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
        data: {
          keyword: searchBarInput,
          property: selectorsRequest,
        },
      });

      setSelectors(objectsOfAdvancedSearch.data.search);
      // console.log(
      //   "objectsListOfAdvancedSearch.data.result ==>",
      //   objectsOfAdvancedSearch.data.result
      // );
      setObjectListing({
        id: "FiltredObjects",
        name: "Liste des objets filtrés",
        children: objectsOfAdvancedSearch.data.result,
      });
      setSelectorsLoader(false);
      setObjectsLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getObjectsOfSelectedObject = async () => {
    try {
      setObjectsLoader(true);

      const treeOfObjectSet = await axios.get(
        `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObjectSet}/tree-structure`,
        {
          headers: {
            "content-type": "application/json",
            "X-Auth-Token": sessionStorage.getItem("token"),
          },
        }
      );

      setObjectListing(treeOfObjectSet.data);
      //console.log("objectListing ==>", treeOfObjectSet.data);

      setObjectsLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  // const getObjects = async (typeProperties, selectedPage) => {
  //   const classes = await axios.get(
  //     `${process.env.REACT_APP_API_DATBIM}/classes/mapping/${typeProperties}`,
  //     {
  //       headers: {
  //         "X-Auth-Token": sessionStorage.getItem("token"),
  //       },
  //     }
  //   );

  //   Promise.all(
  //     classes.data.properties.map(async (classProperty) => {
  //       return await axios.get(
  //         `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/objects/${classProperty.class_reference_id}`,
  //         {
  //           headers: {
  //             "X-Auth-Token": sessionStorage.getItem("token"),
  //           },
  //         }
  //       );
  //     })
  //   ).then(function (values) {
  //     const objects = values.reduce((acc, value) => {
  //       if (value.data.properties) {
  //         return acc.concat(value.data.properties);
  //       }

  //       return acc;
  //     }, []);
  //     setObjectListDefault(objects);
  //     setObjects(objects);
  //     setObjectsLoader(false);
  //   });
  // }

  // const searchObject = (input) => {
  //   if (objectListDefault && objectListDefault.length > 0) {
  //     const filtered = objectListDefault.filter((object) => {
  //       const searchByObjectName = object.object_name
  //         .toLowerCase()
  //         .includes(input.toLowerCase());
  //       const searchByOrganizationName = object.organization_name
  //         .toLowerCase()
  //         .includes(input.toLowerCase());

  //       if (searchByObjectName) {
  //         return searchByObjectName;
  //       } else if (searchByOrganizationName) {
  //         return searchByOrganizationName;
  //       }
  //     });
  //     setSearchInput(input);
  //     setObjects(filtered);
  //   }
  // }

  const handleChangeKeyword = (value) => {
    console.log(value);
    setSearchBarInput(value);
  };

  const resetSelectors = () => {
    setSearchBarInput("");
    setSelectorsRequest([]);
    getSelectorsOfObjectSet();
    getObjectsOfSelectedObject();
    setSelectedObject(null);
  };

  const childRenderTree = ([renderedChildren, count], node) => {
    const [renderedChild, newCount] = renderTree(node, count);
    return [renderedChildren.concat(<div>{renderedChild}</div>), newCount];
  };

  const renderTree = (nodes, count) => {
    const [children, newCount] =
      Array.isArray(nodes.children) && nodes.children.length > 0
        ? nodes.children.reduce(childRenderTree, [[], count])
        : [null, count + 1];

    // Condition pour vérifier si l'élément a des enfants ou est le dernier niveau
    let lastLevel;
    if (nodes.children) {
      lastLevel = !Array.isArray(nodes?.children) || nodes?.children?.length === 0;
    }
    if (nodes.geometry) {
      console.log('nodes geom', `${nodes.name}`)
    }

    return [
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        onClick={() => {
          setObjectGeometry(nodes.geometry);
          setSelectedObject(nodes.id);
          setSelectedObjectName(nodes.name);
          setIsLastLevel(lastLevel);
        }}
      >
        {children}
      </TreeItem>,
      newCount,
    ];
  };

  const getExpandedNodes = async (list, node) => {
    list.push(`${node.id}`);
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        getExpandedNodes(list, child);
      });
    }
  };

  let listing = null;

  if (objectListing) {
    const [tree, count] = renderTree(objectListing, 0);
    let selectedObjectListing = [];
    if (objectListing.id === "FiltredObjects") {
      getExpandedNodes(selectedObjectListing, objectListing);
    }
    listing = (
      <Grid item xs={12}>
        <Typography>Objets trouvés: {count}</Typography>
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          // defaultExpanded={
          //   objectListing.id === "FiltredObjects"
          //     ? [`${objectListing.id}`, `${objectListing.children[0].id}`]
          //     : [`${objectListing.id}`]
          // }
          defaultExpanded={
            objectListing.id === "FiltredObjects"
              ? selectedObjectListing
              : [`${objectListing.id}`]
          }
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{
            height: 1100,
            flexGrow: 1,
            maxWidth: 400,
            overflowY: "auto",
          }}
        >
          {tree}
        </TreeView>
      </Grid>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Typography
              href="/"
              className={classes.link}
              onClick={(e) => setActiveStep(1)}
            >
              Portails
            </Typography>
            <Typography
              href="/"
              className={classes.link}
              onClick={(e) => setActiveStep(2)}
            >
              {breadcrumbMap[0].length > 15
                ? breadcrumbMap[0].slice(0, 15) + "..."
                : breadcrumbMap[0]}
            </Typography>
            <Typography color={selectedObjectName ? "inherit" : "textPrimary"}>
              {breadcrumbMap[1]}
            </Typography>
            {/* <Typography color={selectedObjectName ? "textPrimary" : "inherit"}>
              {selectedObject &&
                (selectedObjectName.length > 20
                  ? selectedObjectName.slice(0, 20) + "..."
                  : selectedObjectName)}
            </Typography> */}
          </Breadcrumbs>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" component="h3">
            {`Sélectionnez un objet: ${selectedObjectName}`}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <SearchBar
            disabled={objectsLoader === true}
            input={searchBarInput}
            onChange={handleChangeKeyword}
            className={classes.searchBar}
            placeholder="Mot clé"
            onClickOne={() => getObjectsOfAdvancedSearch(selectorsRequest)}
            onClickTwo={resetSelectors}
          />
        </Grid>
        <Divider />

        <Grid item sm={5}>
          {objectsLoader ? (
            <Grid container justify="center">
              <CircularProgress color="inherit" />
            </Grid>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SelectionComponent
                    zIndex="2"
                    selectors={selectors}
                    selectorsLoader={selectorsLoader}
                    getObjectsOfAdvancedSearch={getObjectsOfAdvancedSearch}
                    selectorsRequest={selectorsRequest}
                    setSelectorsRequest={setSelectorsRequest}
                    resetSelectors={resetSelectors}
                  />
                </Grid>
                {listing}
              </Grid>

              {/* {objects?.meta && (
                  <Pagination
                    count={objects.meta.current_items}
                    onChange={(e, value) => getObjects(typeProperties, value)}
                    variant="outlined"
                  />
                )} */}
            </>
          )}
        </Grid>
        <Grid item sm={7}>
          <Paper square style={{ textTransform: "none" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="Propriétés" style={{ textTransform: "none" }} {...a11yProps(0)} />
              {/* <Tab label="Connecteurs" style={{textTransform: "none"}} {...a11yProps(1)} /> */}
            </Tabs>
          </Paper>
          <TabPanel value={value} index={0}>
            <PropertyList
              classes={classes}
              projectId={projectId}
              objSelected={objSelected}
              selectedObject={selectedObject}
              bimData={bimData}
              setBimData={setBimData}
              viewer={viewer}
              modelID={modelID}
              eids={eids}
              setEids={setEids}
              addElementsNewProperties={addElementsNewProperties}
              handleShowMarketplace={handleShowMarketplace}
              properties={properties}
              setProperties={setProperties}
              selectorsRequest={selectorsRequest}
            />
          </TabPanel>
          {typeof window.CefSharp !== "undefined" ? (
            <>
              {(properties?.length > 0 && objectGeometry) &&
                <>
                  <RevitConnector
                    selectedObject={selectedObject}
                    properties={properties}
                    setProperties={setProperties}
                    selectedPortal={selectedPortal}
                  />
                  {/* <SpeckleConnector
                    selectedObject={selectedObject}
                    properties={properties}
                    setProperties={setProperties}
                    selectedPortal={selectedPortal}
                  /> */}
                </>
              }
            </>
          ) : (
            <>
              {(properties?.length > 0 && objectGeometry) &&
                <>
                  <IfcConnector
                    selectedObject={selectedObject}
                    properties={properties}
                    setProperties={setProperties}
                    selectedObjectName={selectedObjectName}
                    selectedPortal={selectedPortal}
                  />
                  <SpeckleConnector
                    selectedObject={selectedObject}
                    properties={properties}
                    setProperties={setProperties}
                    selectedPortal={selectedPortal}
                  />
                </>
              }
            </>
          )}
          {/* <TabPanel value={value} index={1}>
          <Connectors 
              selectedObject={selectedObject}
              properties={properties}
              setProperties = {setProperties}
          />
        </TabPanel> */}
        </Grid>

      </Grid>
    </>
  );
};

export default ObjectList;


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}