import React, { useState, Fragment, useEffect } from 'react';
import {
  withStyles,
  Typography,
  Grid
} from '@material-ui/core';
import { useParams, useLocation } from 'react-router-dom';

import ActionItems from '../components/actionItems';
import ErrorSnackbar from '../components/errorSnackbar';
import MeasurementButtons from '../components/measurementButton';
import InfoSnackbar from '..//components/infoSnackbar'

const API = window.env.BACKEND_URL;
const REXECUTION_TIMEOUT = 5000   // rexecution timeout for retry of the failed fetch calls
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    position: 'absolute',
    top: theme.spacing(4.5),
    left: theme.spacing(13.5),
    color: 'white'
  },
  measurementGroupTitle: {
    fontSize: "5vh"
  }
});

function UseCaseMeasurement(props) {
  const { classes } = props;

  // use case
  const [useCaseId, setUseCaseId] = useState("");
  const [useCaseDetails, setUseCaseDetails] = useState('');
  const [measurementsCount, setMeasurementsCount] = useState(0);
  const [lastMeasurementId, setLastMeasurementId] = useState("");
  const [pinCode, setPinCode] = useState(null);

  // general
  const [displayText, setDisplayText] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectivityIssue, setConnectivityIssue] = useState(false);

  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const useCaseId = id;
    let body = {
      pinCode: pinCode
    }

    body.pinCode = new URLSearchParams(location).get("pinCode")
    if (!body.pinCode) {
      body.pinCode = prompt("Please provide the secure pincode of this use case to access the measurement area")
    }

    setPinCode(body.pinCode)

    // check if correct pin has been provided
    custom_fetch('post', '/useCases/' + useCaseId + '/authorize', body)
      .then(response => {
        // if succesfully set useCase ID and load cases, otherwise show error
        setUseCaseId(useCaseId);
      })
      .catch(error => {
        setError({ message: "Wrong pinCode provide there for no access granted" })
      })
  }, []);

  useEffect(() => {
    getUseCase()
  }, [useCaseId]);


  const custom_fetch = async (method, endpoint, body, surpressError) => {
    setLoading(true);

    try {
      const response = await fetch(`${API}/api${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });

      setLoading(false);

      if (response.ok && (response.status === 201 || response.status === 200)) {
        return await response.json();
      } else {
        setError({ message: "Error when communicating with backend: " + response.statusText })

        throw new Error("Error communicating with backend")
      }
    } catch (error) {
      // used to surpress the error notifcation
      if (!surpressError) {
        setError(error)
        setLoading(false);
      }

      throw new Error(error)
    }
  }

  // recursive extension of the fetch method
  // allows to reexecute failed fetch calls until they succeded
  const fetch_retry = async (method, endpoint, body) => {
    let error = null

    try {
      return await custom_fetch(method, endpoint, body, true)
    }
    catch (err) {
      error = err
      // retry after some wait period, and update state if not already done
      if (!connectivityIssue) {
        setConnectivityIssue(true)
        setError({ message: "Error when communicating with backend. We are continuously trying it and will inform you as soon as the connection has ben reestablished. The measurements are still being saved locally and synchronized as soon as connection is present again." })
      }

      await sleep(REXECUTION_TIMEOUT)
      return fetch_retry(method, endpoint, body)
    }
    finally {
      // if err
      if (!error && connectivityIssue) {
        setConnectivityIssue(false)
        setSuccess("Connection established again. Now syncing your measurements. Check the above measurement counter.")
      }
    }
  }

  // function which sleeps some defined milliseconds
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const getMeasurementsCount = async () => {
    let measurementsCount = []
    if (useCaseId) measurementsCount = await custom_fetch('get', '/useCases/' + useCaseId + '/measurements/count')

    setMeasurementsCount(measurementsCount)
  }

  const getUseCase = async () => {
    setUseCaseDetails((await custom_fetch('get', '/useCases/' + useCaseId)) || [])
    getMeasurementsCount()
  }

  const deleteLastMeasurement = async () => {
    //only allowed to delete the last measurement by themselves
    if (lastMeasurementId) {
      await custom_fetch("DELETE", "/measurements/" + lastMeasurementId)

      getMeasurementsCount()
      setLastMeasurementId("")
      setSuccess("Your last measurement was successfully deleted")
    } else {
      setError({ message: "You can only delete your own last measurement, please execute a measurement first" })
    }
  }

  const saveMeasurement = async (groupName, buttonValue) => {
    const postData = {
      "useCase": useCaseId,
      "groupName": groupName,
      "timestamp": Date.now(),      // set measurement time in frontend
      "value": buttonValue
    }

    // post data as long till it is successfull
    await fetch_retry('post', `/measurements/`, postData)
      .then(response => {
        setLastMeasurementId(response.id)
        getMeasurementsCount()
      })
  }

  // copy the direct link to a use case measurement to the clipboard
  // the link includes the PIN code
  const shareLink = () => {
    let url = window.location.href + "?pinCode=" + pinCode
    navigator.clipboard.writeText(url)

    setSuccess("Direct link copied to clipboard")
  }

  // toogle if text should be displayed or not
  const toogleIconView = () => {
    setDisplayText(!displayText)
  }

  // toogle full screen
  const toggleFullscreen = () => {
    let elem = document.querySelector("body");

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <Fragment>
      <Typography className={classes.title} variant="h6">Measurements {useCaseDetails.name} </Typography>

      { /* action items */}
      <ActionItems
        toggleFullscreen={toggleFullscreen}
        toogleIconView={toogleIconView}
        shareLink={shareLink}
        deleteLastMeasurement={deleteLastMeasurement}
        measurementsCount={measurementsCount}
        useCaseId={useCaseId}
      />

      {useCaseDetails && useCaseDetails.measurementOptions && useCaseDetails.measurementOptions.length > 0 ? (
        // measurements present

        useCaseDetails.measurementOptions.map(function (groupElement, groupIndex, groupArray) {
          // iteration for groups

          let buttons = groupElement.options.map(function (optionElement, opionIndex, optionsArray) {
            // iteration for buttons

            return (
              <Grid item xs key={opionIndex}>
                <MeasurementButtons
                  onClick={saveMeasurement}
                  key={`${opionIndex}-${optionElement.name}`}
                  groupName={groupElement.name}
                  buttonValue={optionElement.name}
                  length={optionsArray.length}
                  groupLength={groupArray.length}
                  displayText={displayText}
                  icon={optionElement.icon}
                />
              </Grid>
            )
          })

          return (
            <div className={classes.root} key={`${groupIndex}buttonList`}>
              <Typography className={classes.measurementGroupTitle}>{groupElement.name}</Typography>
              <Grid container spacing={1}>
                {buttons}
              </Grid>
            </div>
          )
        })

      ) : (
        // no measurements could be found
        !loading && (
          <Typography variant="subtitle1">No measurements have been taken so far</Typography>
        )
      )}

      { /* Flag based display of error snackbar */}
      {error && (
        <ErrorSnackbar
          onClose={() => setError(null)}
          message={error.message}
        />
      )}

      { /* Flag based display of info snackbar */}
      {success && (
        <InfoSnackbar
          onClose={() => setSuccess(null)}
          message={success}
        />
      )}
    </Fragment>
  );
}

export default withStyles(styles)(UseCaseMeasurement);
