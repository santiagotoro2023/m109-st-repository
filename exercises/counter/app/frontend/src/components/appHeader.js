import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  withStyles,
} from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Help from './help'

const styles = theme => ({
  headerButton: {
    position: 'fixed',
    top: theme.spacing(-0.5),
    right: theme.spacing(),
    color: '#f50057',
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(-1),
      right: theme.spacing(0),
    }
  },
  helpIcon: {
    fontSize: '4.5em',
    color: 'white',
  },
  toolBar: {
    backgroundColor: "#ba4682",
    padding: theme.spacing(1)
  },
  image: {
    height: '40px'
  }
})

function AppHeader(props) {
  const { classes } = props
  const [showHelp, setShowHelp] = useState(false)

  const handleChange = () => {
    setShowHelp(!showHelp)
  }

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolBar}>
        <Button color="inherit" component={Link} to="/">
          <img className={classes.image} src={`${window.location.origin}/images/header.png`} alt="Header" />
          <Typography variant="h6" color="inherit">
            Counter
          </Typography>
        </Button>

        <Button
          onClick={handleChange}
          className={classes.headerButton}
        >
          <HelpOutlineIcon
            color="secondary"
            aria-label="add"
            className={classes.helpIcon}
          />
        </Button>

        <Help
          handleChange={handleChange}
          showModal={showHelp}
        />
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles)(AppHeader);
