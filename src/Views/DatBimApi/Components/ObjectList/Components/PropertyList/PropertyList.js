import React, { useEffect, useState } from "react";

import {
  Grid,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
  Paper,
  TableCell,
  makeStyles,
  Input,
  InputLabel,
  InputAdornment,
  Tooltip,
  IconButton,
  Checkbox,
} from "@material-ui/core";
import {
  Alert
} from "@material-ui/lab";
import Add from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import SearchBar from "../../../../../../Components/SearchBar";
import DefineTypeComponent from "./DefineTypeComponent";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles((theme) => ({
  searchBar: {
    width: "100%",
    underline: "black",
    margin: "20px 0px",
    "&:before": {
      borderBottom: "1px solid #E6464D",
    },
    "&:after": {
      borderBottom: `2px solid #E6464D`,
    },
  },
  datBimList: {
    color: "white",
    "&:nth-child(odd)": {
      backgroundColor: "#DCDCDC",
      opacity: 0.8,
    },
  },
  datBimCardTitle: {
    margin: 0,
    color: "white",
  },
  table: {
    minWidth: "100%",
  },
  button: {
    marginTop: "10px",
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

const PropertyList = ({
  projectId,
  setLoader,
  objSelected,
  selectedObject,
  viewer,
  modelID,
  eids,
  setEids,
  addElementsNewProperties,
  handleShowMarketplace,
  properties,
  setProperties
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [propertyListDefault, setPropertyListDefault] = useState([]);
  const [allChecked, setAllChecked] = useState(true);
  const [status, setStatus] = useState("");
  const history = useHistory();
  const classes = useStyles();

  function searchProperty(input) {
    const filtered = propertyListDefault.filter((property) => {
      return property.property_name.toLowerCase().includes(input.toLowerCase());
    });
    setSearchInput(input);
    setProperties(filtered);
  }

  useEffect(() => {
    const getData = async () => {
      setStatus("");
      await getPropertiesValues();
    }

    getData();
  }, [selectedObject]);

  const getPropertiesValues = async () => {
    try {
      const { data: dataProp } = await axios.get(
        `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObject}/properties-values`,
        {
          headers: {
            "X-Auth-Token": sessionStorage.getItem("token"),
          },
        }
      );
      console.log("data", dataProp);
      const dataPropFilter = dataProp.data.filter(
        (prop) => prop.property_visibility
      );

      const dataWithCheckStatus = dataPropFilter.map((property) => {
        return {
          ...property,
          checked: true,
        };
      });

      const temporaryFixProperties = dataWithCheckStatus.map((property) => {
        if (
          property.data_type_name === "Entier" &&
          property.text_value === "A saisir"
        ) {
          return {
            ...property,
            text_value: 0,
          };
        }

        if (property.data_type_name === "Lien") {
          const newLink = property.text_value.replace("Https", "https");
          return {
            ...property,
            text_value: newLink,
          };
        }
        // console.log("Property =>", property);
        return property;
      });

      setPropertyListDefault(temporaryFixProperties);
      setProperties(temporaryFixProperties);

      // console.log("temporaryFixProperties", temporaryFixProperties);
    } catch (err) {
      console.log("error", err);
    }
  };

  const postGeometry = async (properties, objSelected) => {
    try {
      console.log('properties', properties);
      console.log('objSelected', objSelected);

      const updatedProperties = [];

      for(let property of properties) {
        updatedProperties.push(updatePorperty(property));
      }

      // const fileName = `object_${objSelected}_properties`;
      // const json = JSON.stringify(updatedProperties);
      // const blob = new Blob([json], { type: 'application/json' });
      // const href = await URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = href;
      // link.download = fileName + ".json";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      const objectGeometry = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObject}/get-model-file/glb`,
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
        data: updatedProperties,
      });

      // const objectGeometry = await axios({
      //   method: "post",
      //   url: "http://localhost:5000/opendthx/postGeometry",
      //   headers: {
      //     "content-type": "application/json",
      //     "X-Auth-Token": sessionStorage.getItem("token"),
      //   },
      //   data: {
      //     url:  `${process.env.REACT_APP_API_DATBIM}`,
      //     token: sessionStorage.getItem("token"),
      //     objectId: selectedObject,
      //     properties: updatedProperties
      //   },
      // });

      console.log("objectGeometry", objectGeometry);

    } catch (err) {
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
  }



  const handleCheckedProperties = (e) => {
    // console.log(`Checkbox id:`, e.target.id);
    // console.log(`Checkbox check:`, e.target.checked);
    console.log("properties", properties);

    const index = e.target.id;
    const checkStatus = e.target.checked;

    const newPropertiesArr = [...properties];
    newPropertiesArr[index].checked = checkStatus;

    if (!checkStatus) {
      setAllChecked(false);
    } else {
      for (let i = 0; i < properties.length; i++) {
        if (properties[i].checked === true) {
          setAllChecked(true);
        } else {
          setAllChecked(false);
          break;
        }
      }
    }

    setProperties(newPropertiesArr);
  };

  const handleGlobalCheckedProperties = (e) => {
    const checked = e.target.checked;

    if (!checked) {
      // console.log("properties ==>", properties);
      // console.log("All checked ==> now to be unchecked");

      properties.map((property) => {
        property.checked = false;
      });

      setAllChecked(false);
    } else {
      // console.log("properties 2 ==>", properties);
      // console.log("One or more are unchecked ==> all are now checked");

      properties.map((property) => {
        property.checked = true;
      });

      setAllChecked(true);
    }
  };

  const configureProperty = (index, key) => (e, value) => {
    // console.log("Value =>", value);
    // console.log("index=>", index);

    // console.log("properties", properties);

    // let keyValue = key ? key : 'text_value';
    let inputValue = e.target.value;

    let property = properties[index];
    const newPropertiesArr = [...properties];
    switch (property.data_type_name) {
      case "Intervalle":
        newPropertiesArr[index]['num_value'] = inputValue || value;
        newPropertiesArr[index]['text_value'] = inputValue || value;
        break;
      default:
        newPropertiesArr[index]['text_value'] = inputValue || value;
        break;
    }
    // const newPropertiesArr = [...properties];
    // newPropertiesArr[index][keyValue] = inputValue || value;
    // newPropertiesArr[index].value = inputValue || value;

    setProperties(newPropertiesArr);
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



  const addElementsDatBimProperties = async (properties) => {
    const filteredProperties = properties.filter(
      (property) => property.checked
    );

    const updateProperties = [];
    for (let property of filteredProperties) {
      updateProperties.push(updatePorperty(property));
    }

    console.log('updateProperties', updateProperties)

    const signingProperties = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObject}/signing`,
      headers: {
        "content-type": "application/json",
        "X-Auth-Token": sessionStorage.getItem("token"),
      },
      data: updateProperties,
    });

    console.log('data from datbim', signingProperties)

    // addElementsNewProperties({
    //   viewer,
    //   modelID,
    //   expressIDs: eids,
    //   properties: updateProperties,
    // });
    // handleShowMarketplace("home");
  };




  console.log("properties", properties);
  return (
    <TableContainer component={Paper}>
      {/* <SearchBar
            input={searchInput}
            onChange={searchProperty}
            className={classes.searchBar}
            placeholder="Chercher un Objet"
          /> */}
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={`${classes.root} ${classes.datBimCardTitle}`}>
            <TableCell>Propri??t??</TableCell>
            <TableCell align="center">Info</TableCell>
            <TableCell align="center">Valeur</TableCell>
            <TableCell align="center">Unit??</TableCell>
            {selectedObject ? (
              <TableCell align="center">
                Ajouter
                <Checkbox
                  defaultChecked
                  checked={allChecked}
                  onChange={handleGlobalCheckedProperties}
                />
              </TableCell>
            ) : (
              ""
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {properties?.map((property, propertyIndex) => (
            <TableRow
              key={propertyIndex}
              className={`${classes.root} ${classes.datBimList}`}
            >
              <TableCell width="35%" component="th" scope="row">
                {property.property_name}
              </TableCell>
              <TableCell width="10%" component="th" scope="row">
                {property.property_definition && (
                  <Tooltip
                    title={`${property.property_definition}`}
                    placement="top-start"
                  >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell width="35%" align="right">
                {DefineTypeComponent(
                  property.data_type_name,
                  property,
                  propertyIndex,
                  configureProperty
                )}
              </TableCell>
              <TableCell width="10%" align="center">
                {property.unit}
              </TableCell>
              <TableCell width="10%" align="center">
                <Checkbox
                  defaultChecked
                  checked={properties[propertyIndex].checked}
                  onChange={handleCheckedProperties}
                  id={propertyIndex}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid row align="left">
        <Button
          variant="contained"
          onClick={() => {
            postGeometry(properties, selectedObject);
          }}
          color="primary"
          className={classes.button}
        >
          G??om??trie
        </Button>
      </Grid>
      <Grid row align="right">
        <Button
          variant="contained"
          onClick={() => {
            // if(eids && eids.length > 0) {
            //    addElementsDatBimProperties(properties, objSelected);
            // }
            addElementsDatBimProperties(properties);
          }}
          color="primary"
          className={classes.button}
        >
          Ajouter
        </Button>
      </Grid>
      {(status !== "") &&
        <Grid item xs={12}>
          <Alert severity={'error'}>{`${status}`}</Alert>
        </Grid>
      }
    </TableContainer>
  );
};

export default PropertyList;
