import React, { Component, useState } from 'react';
import Helmet from 'react-helmet';
import {
  Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import './App.css';
import history from './history';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppContainerElem from './Components/AppContainerElem';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@material-ui/core';
import Icon from './Icon.svg';
import Logo from './logo_Open_dthX.png';
import DatBimApi from './Views/DatBimApi/DatBimApi';

const Menu = {
  MenuNavBar: [
    { text: "", link: "", href: "", icon: "" }
  ],
  MenuSideBarSup: [
    { text: "Home", link: "/", href: "", icon: "dashboard" },
  ],
  MenuSideBarInf: [
    { text: "GitHub", link: "", href: "https://github.com/tridyme/sdk-structure-app", icon: "code" }
  ]
};

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            // light: will be calculated from palette.primary.main,
            main: '#000000',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
          },
          secondary: {
            //light: '#0066ff',
            main: '#ff0000',
            // dark: will be calculated from palette.secondary.main,
            //contrastText: '#ffcc00',
          },
        },
      }),
    [prefersDarkMode],
  );


  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>{`opendthX | API connexion`}</title>
        <link rel="icon" type="image/png" href={Logo} sizes="16x16" />
      </Helmet>
      <Router history={history}>
        <AppContainerElem
          title={<ListItem>
            <ListItemAvatar>
              <Avatar
                alt={`Open-dthX`}
                src={Logo}
              />
            </ListItemAvatar>
            <ListItemText primary={`Open-dthX`} />
          </ListItem>}
          menu={Menu}
        >
          <Switch>
            <Route exact path="/open-dthx" component={DatBimApi} />
            <Redirect from="/" to="/open-dthx" />
          </Switch>
        </AppContainerElem>
      </Router>
    </ThemeProvider>
  );
};

export default App;
