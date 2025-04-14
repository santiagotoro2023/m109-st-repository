import React, { Fragment } from 'react';
import {
  withStyles,
  Fab,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

import ListIcon from '@material-ui/icons/List';
import ShareIcon from '@material-ui/icons/Share';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import UndoIcon from '@material-ui/icons/Undo';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const styles = theme => ({
  disabled: {},
  fabDelete: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(26.5),
    zIndex: 100,
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(16.5),
    },
  },
  fabCount: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(10.5),
    zIndex: 100,
    "&$disabled": {
      backgroundColor: "#f50057",
      color: "white"
    },
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(9),
    },
  },
  fabList: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(18.5),
    zIndex: 100,
    [theme.breakpoints.down('xs')]: {
      visibility: "hidden"
    },
  },
  fabShare: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(34.5),
    zIndex: 100,
    [theme.breakpoints.down('xs')]: {
      visibility: "hidden"
    },
  },
  fabToogle: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(42.5),
    zIndex: 100,
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(24),
    },
  },
  fabFullScreen: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(50.5),
    zIndex: 100,
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(31.5),
    },
  },
})

function ActionItems(props) {
  const { classes, toggleFullscreen, toogleIconView, shareLink, deleteLastMeasurement, measurementsCount, useCaseId } = props;
  const to = "/useCases/" + useCaseId + "/measurements/view"

  return (
    <Fragment>
      <Fab
        color="secondary"
        aria-label="export"
        className={classes.fabFullScreen}
        onClick={toggleFullscreen}
      >
        <FullscreenIcon />
      </Fab>

      <Fab
        color="secondary"
        aria-label="export"
        className={classes.fabToogle}
        onClick={toogleIconView}
      >
        <TouchAppIcon />
      </Fab>

      <Fab
        color="secondary"
        aria-label="export"
        className={classes.fabShare}
        onClick={shareLink}
      >
        <ShareIcon />
      </Fab>

      <Fab
        color="secondary"
        aria-label="export"
        className={classes.fabDelete}
        onClick={deleteLastMeasurement}
      >
        <UndoIcon />
      </Fab>

      <Fab
        color="secondary"
        aria-label="edit"
        disabled={true}
        className={classes.fabCount}
        classes={{ disabled: classes.disabled }}
      >
        {measurementsCount}
      </Fab>

      <Fab
        color="secondary"
        aria-label="export"
        className={classes.fabList}
        component={Link}
        to={to}
      >
        <ListIcon />
      </Fab>
    </Fragment>
  )
}

export default withStyles(styles)(ActionItems);
