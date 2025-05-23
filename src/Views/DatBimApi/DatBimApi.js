import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Typography,
  Step,
  StepLabel,
  withStyles,
  Stepper,
} from "@material-ui/core";
import {
  Alert
} from "@material-ui/lab";
import StepConnector from "@material-ui/core/StepConnector";
import clsx from "clsx";
import Check from "@material-ui/icons/Check";
import Login from "./Components/Login/Login";
import PortalList from "./Components/PortalList/PortalList";
import ObjectsSetsList from "./Components/ObjectsSetsList/ObjectsSetsList";
import ObjectList from "./Components/ObjectList/ObjectList";
import axios from "axios";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      backgroundColor: "white",
    },
  },
  button: {
    fontSize: 40,
    borderRadius: "10%",
    backgroundColor: "#E6464D",
    color: "white",
    "&:hover": {
      backgroundColor: "#E6464D",
      color: "white",
      cursor: "pointer",
    },
    "&:disabled": {
      opacity: 0.8,
      color: "white",
    },
  },
  headerButton: {
    // fontSize: 30,
    borderRadius: "50%",
    color: "#E6464D",
    "&:hover": {
      color: "white",
      backgroundColor: "#E6464D",
      cursor: "pointer",
    },
  },
  navigationBar: {
    margin: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: "10px",
  },
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
  modalDatBim: {
    width: "50%",
    height: "70%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "hidden scroll",
    position: "relative",
  },
  datBimCard: {
    backgroundColor: "#E6464D",
    color: "white",
    margin: theme.spacing(1),
    cursor: "pointer",
    height: "8em",
  },
  datBimTitle: {
    textAlign: "center",
    textTransform: "none",
  },
  datBimCardTitle: {
    margin: 0,
    color: "white",
  },
  datBimFooterCard: {
    display: "block",
    textAlign: "right",
  },
  datBimCardButton: {
    textAlign: "right",
    color: "white",
  },
  accordionDetails: {
    display: "block",
  },
  datBimIcon: {
    width: "3em",
  },
}));

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#E6464D",
    display: "flex",
    height: 22,
    alignItems: "right",
  },
  active: {
    color: "#E6464D",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#E6464D",
    zIndex: 1,
    fontSize: 18,
  },
});

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: "#E6464D",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#E6464D",
    },
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const {
  REACT_APP_LOGO,
  REACT_APP_COMPANY,
  REACT_APP_VERSION
} = process.env;

const DatBimApi = ({
  bimData,
  setBimData,
  viewer,
  modelID,
  eids,
  setEids,
  addElementsNewProperties,
  handleShowMarketplace,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [breadcrumbMap, setBreadcrumbMap] = useState([]);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [selectedObjectSet, setSelectedObjectSet] = useState(null);
  const [selectedObjectSetName, setSelectedObjectSetName] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [validation, setValidation] = useState({
    status: true,
    message: 'Connected',
  });

  useEffect(() => {
    const init = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        handleNext();
      }
    };
    init();
  }, []);

  const steps = getSteps();
  const classes = useStyles();

  function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
        })}
      >
        {completed ? (
          <Check className={classes.completed} />
        ) : (
          <div className={classes.circle} />
        )}
      </div>
    );
  }

  function getSteps() {
    return ["Connexion", "Portails", "Collections d'objets", "Objets"];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    localStorage.setItem("email", data.get("email"));

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_DATBIM}/auth-token`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: {
        entry_mode: "string",
        ip: "string",
        lang: "fr",
        local_at: "string",
        login: `${data.get("email")}`,
        password: `${data.get("password")}`,
        service: "string",
      },
    })
      .then((r) => {
        console.log("TOKEN", r.data);
        sessionStorage.setItem("token", r.data.token);
        setValidation({
          status: true,
          message: 'Connecté'
        })
        handleNext();
      })
      .catch((error) => {
        console.log('error', error);
        setValidation({
          status: false,
          message: 'Erreur de connexion'
        })
        setActiveStep(0);
      });
  };

  const handleDisconnect = async () => {
    sessionStorage.setItem("token", null);
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function openObjects(id) {
    setSelectedPortal(id);
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <Login handleSubmit={handleSubmit} />;
      case 1:
        return (
          <PortalList
            openObjects={openObjects}
            setSelectedPortal={setSelectedPortal}
            handleNext={handleNext}
            breadcrumbMap={breadcrumbMap}
            setBreadcrumbMap={setBreadcrumbMap}
            setActiveStep={setActiveStep}
          />
        );
      case 2:
        return (
          <ObjectsSetsList
            selectedPortal={selectedPortal}
            setSelectedObjectSet={setSelectedObjectSet}
            setSelectedObjectSetName={setSelectedObjectSetName}
            viewer={viewer}
            eids={eids}
            breadcrumbMap={breadcrumbMap}
            setBreadcrumbMap={setBreadcrumbMap}
            handleNext={handleNext}
            setActiveStep={setActiveStep}
          />
        );
      case 3:
        return (
          <ObjectList
            bimData={bimData}
            setBimData={setBimData}
            selectedObject={selectedObject}
            selectedObjectSet={selectedObjectSet}
            selectedObjectSetName={selectedObjectSetName}
            setSelectedObject={setSelectedObject}
            handleNext={handleNext}
            selectedPortal={selectedPortal}
            // typeProperties={window.objProperties.type}
            typeProperties={"IfcWall"}
            viewer={viewer}
            modelID={modelID}
            eids={eids}
            setEids={setEids}
            addElementsNewProperties={addElementsNewProperties}
            handleShowMarketplace={handleShowMarketplace}
            breadcrumbMap={breadcrumbMap}
            setBreadcrumbMap={setBreadcrumbMap}
            setActiveStep={setActiveStep}
          />
        );
      default:
        return "Unknown step";
    }
  }

  return (
    <div
    //style={{ backgroundColor: 'white'}}
    >
      <Grid container>
        <Grid item xs={12} style={{ textAlign: "right" }}>
          <a style={{ color: "inherit" }} target="_blank">
            {`${REACT_APP_VERSION}`}
          </a>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "left" }}>
          {activeStep > 0 && (
            <KeyboardBackspaceIcon
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.headerButton}
            />
          )}
        </Grid>
        <Grid item xs={6} style={{ textAlign: "right" }}>
          {activeStep > 0 && (
            <PowerSettingsNewIcon
              className={classes.headerButton}
              onClick={handleDisconnect}
            />
          )}
        </Grid>
      </Grid>
      <Stepper
        alternativeLabel
        style={{ backgroundColor: "transparent" }}
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* <div className={classes.navigationBar}>
        <Grid container>
          <Grid item xs={6}>
            {activeStep > 0 && (
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
            )}
          </Grid>
        </Grid>
      </div> */}
      <Typography className={classes.instructions}>
        {getStepContent(activeStep)}
      </Typography>
      {(!validation.status && activeStep === 0) &&
        <Grid item xs={12}>
          <Alert severity={'error'}>{`${validation.message}`}</Alert>
        </Grid>
      }
    </div>
  );
};

export default DatBimApi;
