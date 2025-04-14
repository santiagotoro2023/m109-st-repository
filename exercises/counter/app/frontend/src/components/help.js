import React, { Fragment, useEffect, useState } from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Typography,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 600,
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(5),
  },
  textCenter: {
    margin: 'auto'
  },
  images: {
    width: '100%'
  },
  links: {
    textDecoration: 'none',
    color: 'black'
  },
  header: {
    marginTop: theme.spacing(2)
  }
});

function Help(props) {
  const { classes } = props;
  const APP_VERSION = process.env.REACT_APP_VERSION
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal !== props.showModal) {
      setShowModal(props.showModal);
    }
  }, [props.showModal, showModal]);

  const handleChange = () => {
    let parentHandler = props.handleChange
    setShowModal(!showModal);
    parentHandler()
  }

  return (
    <Fragment>
      {showModal && (
        <Modal
          className={classes.modal}
          onClose={handleChange}
          open
        >
          <Card className={`${classes.modalCard} ${classes.marginTop}`}>
            <CardContent className={classes.modalCardContent}>
              <Typography variant="h6">About the app</Typography>
              <Typography> Provides a simple and easy to use interface for creating custimized measurements. </Typography>
              <Typography>Measurments are grouped within a use case. For a use case the counting buttons can be defined.</Typography>
              <Typography> When clicking on a button the timestamp and bottom value is stored. The stored values can be easily exported.</Typography>
              <Typography>App version: {APP_VERSION}</Typography>

              <Typography variant="h6" className={classes.header}>Disclaimer</Typography>
              <Typography>This counter tool is provided as is, and no support will be given. Querying a large amount of data within a very short time, for example by automated means, is prohibited. The developers and any other person be liable to any person for any damage or loss that may arise from the use of this couter tool. Please be aware that the use of this counter tool will be deemed as agreeing to the terms of these conditions.</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleChange}><ClearIcon />Close</Button>
            </CardActions>
          </Card>
        </Modal>
      )}

    </Fragment>
  )
}

export default withStyles(styles)(Help);
