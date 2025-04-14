import React from 'react';
import {
  withStyles,
  Snackbar,
  SnackbarContent,
  IconButton,
} from '@material-ui/core';
import { Check as CheckIcon, Close as CloseIcon } from '@material-ui/icons';

const styles = theme => ({
  snackbarContent: {
    backgroundColor: theme.palette.success.dark,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
});
const AUTO_HIDE_DURATION = 10000

const InfoSnackbar = ({ id, message, onClose, classes }) => (
  <Snackbar
    open
    autoHideDuration={AUTO_HIDE_DURATION}
    onClose={onClose}
  >
    <SnackbarContent
      className={`${classes.margin} ${classes.snackbarContent}`}
      aria-describedby={id}
      message={
        <span id={id} className={classes.message}>
          <CheckIcon className={`${classes.icon} ${classes.iconVariant}`} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
    />
  </Snackbar>
);

export default withStyles(styles)(InfoSnackbar);
