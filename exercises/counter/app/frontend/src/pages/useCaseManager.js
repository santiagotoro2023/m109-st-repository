import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Fab,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField
} from '@material-ui/core';
import { Delete as DeleteIcon, Create as CreateIcon, Add as AddIcon } from '@material-ui/icons';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import moment from 'moment';
import { orderBy, filter } from 'lodash';

import UseCaseEditor from '../components/useCaseEditor';
import ErrorSnackbar from '../components/errorSnackbar';
import LoadingBar from '../components/loadingBar'
import InfoSnackbar from '../components/infoSnackbar'

const API = window.env.BACKEND_URL;

const styles = theme => ({
  useCaseDiv: {
    marginTop: theme.spacing(2),
    outline: 0,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    }
  },
  serachDiv: {
    marginBottom: theme.spacing(1)
  },
  searchInput: {
    width: "100%",
  }
});

function UseCaseManager(props) {
  const { classes } = props;
  // use case
  const [query, setQuery] = useState("");
  const [useCases, setUseCases] = useState([]);
  const [useCasesFiltered, setUseCasesFiltered] = useState([]);

  // use case editor
  const [useCase, setUseCase] = useState(null);
  const [useCaseEditorOpen, setUseCaseEditorOpen] = useState(false);
  const [useCaseEditorMode, setUseCaseEditorMode] = useState("create");

  // general
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUseCases();
  }, []);

  useEffect(() => {
    let filteredObjects = filter(useCases, function (obj) {
      return obj.name.toUpperCase().includes(query.toUpperCase());
    })

    setUseCasesFiltered(filteredObjects);
  }, [query, useCases]);

  const custom_fetch = async (method, endpoint, body) => {
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
        console.error(response.status)
        setError({ message: "Error when communicating with backend: " + response.statusText })
      }
    } catch (error) {
      console.error(error);

      setError(error)
      setLoading(false);
    }
  }

  const getUseCases = () => {
    custom_fetch('get', '/useCases')
      .then(useCases => {
        setUseCases(useCases);
      })
  }

  const onSaveUseCase = async (id, name, pinCode, measurementOptions) => {
    const postData = {
      name: name,
      pinCode: pinCode,
      measurementOptions: measurementOptions
    }

    if (id) {
      await custom_fetch('put', `/useCases/${id}`, postData);
    } else {
      await custom_fetch('post', '/useCases', postData);
    }

    getUseCases()

    if (error === null) {
      setUseCaseEditorOpen(false);
    }
  }

  const deleteUseCase = async (useCase) => {
    if (window.confirm(`Are you sure you want to delete "${useCase.name}"`)) {
      // delete also all measurements
      let measurements = await custom_fetch('get', `/useCases/${useCase.id}/measurements`);

      custom_fetch('delete', `/useCases/${useCase.id}`);

      measurements.measurementOptions.forEach(function (element) {
        custom_fetch('delete', `/measurements/${element.id}`);
      })

      if (error === null) {
        setSuccess("Use case successfully deleted")
      }

      getUseCases();
    }
  }

  const handleSearchChange = evt => {
    setQuery(evt.target.value);
  };

  const handleEditorOpen = (useCase, mode) => {
    setUseCase(useCase);
    setUseCaseEditorMode(mode);
    setUseCaseEditorOpen(true);
  };

  return (
    <Fragment>
      <Typography variant="h4">Use Cases</Typography>
      { /* use case area */}
      {useCases && useCases.length > 0 ? (
        // usecases available
        <Paper elevation={1} className={classes.useCaseDiv}>
          <div className={classes.serachDiv}>
            <TextField
              required
              type="text"
              key="inputQuery"
              placeholder="Search"
              label="Search"
              className={classes.searchInput}
              value={query}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              autoFocus
            />
          </div>

          <List>
            {orderBy(useCasesFiltered, ['updatedAt', 'name'], ['desc', 'asc']).map(useCase => (
              <ListItem key={useCase.id} button component={Link} to={`/useCases/${useCase.id}/measurements`}>
                <ListItemText
                  primary={useCase.name}
                  secondary={useCase.updatedAt && `Updated ${moment(useCase.updatedAt).fromNow()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton component={Link} onClick={() => handleEditorOpen(useCase, "copy")} color="inherit">
                    <FileCopyIcon />
                  </IconButton>
                  <IconButton component={Link} onClick={() => handleEditorOpen(useCase, "edit")} color="inherit">
                    <CreateIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteUseCase(useCase)} color="inherit">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>


      ) : (
        // no usecases available
        !loading && (
          <Typography variant="subtitle1">So far no use cases have been created</Typography>
        )
      )}

      <Fragment>
        <Fab
          color="secondary"
          aria-label="add"
          className={classes.fab}
          component={Link}
          onClick={() => { handleEditorOpen(null, 'create') }}
        >
          <AddIcon />
        </Fab>
      </Fragment>

      { /* Use Case Editor */}
      {useCaseEditorOpen && (
        <UseCaseEditor
          useCase={useCase}
          useCaseEditorMode={useCaseEditorMode}
          errorMessage={error}
          onSave={onSaveUseCase}
          onClose={() => { setUseCaseEditorOpen(false) }}
        />
      )}

      { /* Flag based display of loadingbar */}
      {loading && (
        <LoadingBar />
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

export default withStyles(styles)(UseCaseManager);
