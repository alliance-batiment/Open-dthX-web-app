import React, { useEffect, useState } from "react";
import axios from "axios";
import AnalysisIcon from '@material-ui/icons/Assessment';
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Breadcrumbs,
  Typography,
  Divider,
  CardActions,
  CardActionArea,
  Chip,
  Button
} from "@material-ui/core";
import TreeClass from "../../../../../../DatBimApi/Components/ObjectsSetsList/TreeClass";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      backgroundColor: "white",
    },
  },
  datBimCard: {
    backgroundColor: "#E6464D",
    color: "white",
    margin: theme.spacing(1),
    cursor: "pointer",
    // height: "8em",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  datBimCardActionArea: {
    width: "100%",
    height: "100%",
  },
  datBimCardContent: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 0,
  },
  datBimCardTitle: {
    fontSize: 12,
    margin: 0,
    color: "white",
    fontWeight: "bold",
    padding: "1.5em 0 0 1.5em",
  },
  datBimCardDesc: {
    fontSize: 8,
    margin: 0,
    // fontStyle: "italic",
  },
  datBimCardImg: {
    width: "100%",
    height: "100%",
    marginBottom: "1em",
    maxHeight: "250px",
    objectFit: "contain",
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
  link: {
    color: "inherit",
    "&:hover": {
      color: "textPrimary",
      cursor: "pointer",
      textDecoration: "underline",
    },
  },

  noObjectSetsMessage: {
    textAlign: "center",
  },
}));

const DatabaseAnalysis = ({
    viewer,
    selectedPortal,
    setSelectedObjectSet,
    setSelectedObjectSetName,
    eids,
    breadcrumbMap,
    setBreadcrumbMap,
    handleNext,
    setActiveStep,
  
    selectedObject,
    properties,
    setProperties,

  
}) => {
  const classes = useStyles();
  const [objectsSetsList, setObjectsSetsList] = useState([]);
  const [objectsSetsListDefault, setObjectsSetsListDefault] = useState([]);
  const [objectsSetsListWithEIDS, setObjectsSetsListWithEIDS] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [objectsSetsListLoader, setObjectsSetsListLoader] = useState(true);

  useEffect(() => {
    const init = async () => {
      await getObjectsSetsList();
    }
    init();
  }, [eids]);

  const getObjectsSetsList = () => {
    setSearchInput("");

    if (eids?.length > 0) {
      //getobjectsSetsBySelectedEids();
    } else {
      setObjectsSetsList(objectsSetsListDefault);
      getObjectsSets();
    }
  };

  const getObjectsSets = async () => {
    try {
      setObjectsSetsListLoader(true);

      if (objectsSetsListDefault && objectsSetsListDefault.length > 0) {
        setObjectsSetsListLoader(false);
      } else {
        const getObjectsSetsList = await axios.get(
          `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/object-sets`,
          {
            headers: {
              "X-Auth-Token": sessionStorage.getItem("token"),
            },
          }
        );

        //console.log("objectsSetsList", objectsSetsList);
        const objectsSets = getObjectsSetsList.data.data;

        //console.log("objectsSetsList", objectsSets);
        setObjectsSetsListDefault(objectsSets);
        setObjectsSetsList(objectsSets);

        //console.log("objectsSetsListDefault", objectsSets);
        setObjectsSetsListLoader(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const databaseAnalysis = async (classId, properties, selectedObject) => {
    try {
      setObjectsSetsListLoader(true);
      const objectsSetsBySelectedClass = await axios.get(
        `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/object-sets/classes/${classId}`,
        {
          headers: {
            "X-Auth-Token": sessionStorage.getItem("token"),
          },
        }
      );
      console.log("hello");
      setObjectsSetsList(objectsSetsBySelectedClass.data.data);
      setObjectsSetsListWithEIDS(objectsSetsBySelectedClass.data.data);

      /** boucle sur toutes les fiches produits appartenant à PBM Groupe */
      let objectsSetsByPBMGroupFamille = [];
      objectsSetsBySelectedClass.data.data.forEach(product => {
        if(product.organization_name === "PBM Groupe"){
          objectsSetsByPBMGroupFamille.push(product);
        }
      });
      console.log(objectsSetsByPBMGroupFamille);

      
      setObjectsSetsListLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button className={classes.button} style={{ position: 'absolute', top: 260, right: 25}} 
        onClick={() => {
            databaseAnalysis(properties, selectedObject);
        }}
        > <AnalysisIcon />
        Analyse BDD
        </Button>
      </Grid>
    </Grid>
  );
};

export default DatabaseAnalysis;
