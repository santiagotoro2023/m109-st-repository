import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';

import AppHeader from './appHeader';
import UseCaseManager from '../pages/useCaseManager';
import UseCaseMeasurement from '../pages/useCaseMeasurement';
import MeasurementView from '../pages/measurementView';

const styles = theme => ({
  main: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
    },
  },
});

const App = ({ classes }) => (
  <Fragment>
    <CssBaseline />
    <AppHeader />
    <main className={classes.main}>
      <Routes>
        <Route exact path="/" element={<UseCaseManager />} />
        <Route path="useCases">
          <Route exact path="" element={<UseCaseManager />} />
          <Route exact path=":id" element={<UseCaseManager />} />
          <Route exact path=":id/measurements">
            <Route exact path="" element={<UseCaseMeasurement />} />
            <Route exact path="view" element={<MeasurementView />} />
          </Route>
        </Route>
      </Routes>
    </main>
  </Fragment>
);

export default withStyles(styles)(App);
