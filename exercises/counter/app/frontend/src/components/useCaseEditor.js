import React, { useEffect, useState } from 'react';
import {
  TextField,
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Typography,
  FormGroup
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ClearIcon from '@material-ui/icons/Clear';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import './utensils'
import MeasurementOptions from './measurementOptions'
import { deepCopy } from './utensils';

const styles = theme => ({
  modal: {
    display: 'flex',
    outline: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 800,
    maxHeight: "100%",
    overflow: "scroll"
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  formGroup: {
    border: 'solid',
    borderWidth: '1px',
    padding: theme.spacing(1)
  },
  inputField: {
    marginTop: theme.spacing(1)
  }
});

function UseCaseditor(props) {
  const { classes, useCase, useCaseEditorMode, errorMessage, onSave, onClose } = props;

  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [measurementOptions, setMeasurementOptions] = useState([]);

  useEffect(() => {
    if (useCaseEditorMode === "edit") {
      setId(useCase.id);
      setName(useCase.name);
      setMeasurementOptions(useCase.measurementOptions);
    } else if (useCaseEditorMode === "copy") {
      let newUseCase = deepCopy(useCase)
      newUseCase.name = newUseCase.name + " (Copy)"

      setId(null);
      setName("Copy " + newUseCase.name);
      setMeasurementOptions(newUseCase.measurementOptions);
    }
  }, [useCase, useCaseEditorMode]);

  // called by child MeasurementOptions when change of input
  const handleOptionChange = function (groupIndex, options) {
    let tmpOptions = measurementOptions

    tmpOptions[groupIndex].options = options
    setMeasurementOptions(tmpOptions)
  }

  // function handling submit of form
  const handleSubmit = evt => {
    evt.preventDefault();

    // execute parent function in useCaseManager
    onSave(id, name, pinCode, measurementOptions)
  };

  const handleOptionGroupName = (index, event) => {
    let tempMeasurementOptions = deepCopy(measurementOptions)
    tempMeasurementOptions[index].name = event.target.value
    setMeasurementOptions(tempMeasurementOptions)
  }

  const handleChange = (evt) => {
    const target = evt.target
    const name = target.name
    let value = target.value

    switch (name) {
      case "name":
        setName(value)
        break
      case "pinCode":
        setPinCode(value)
        break
      default:
        break
    }
  }

  const handleAddOptionGroup = () => {
    let idx = measurementOptions.length

    setMeasurementOptions(measurementOptions.concat([{ id: idx, name: "", options: [{ name: "", icon: "" }] }]))
  };

  const handleRemoveOptionGroup = idx => () => {
    setMeasurementOptions(measurementOptions.filter((s, sidx) => idx !== sidx));
  };

  const handleCopyOptionGroup = idx => () => {
    let tempMeasurementOptions = measurementOptions
    let newMeasurementOption = { ...tempMeasurementOptions[idx] }
    newMeasurementOption.id = tempMeasurementOptions.length
    tempMeasurementOptions.insert(idx, newMeasurementOption)
    setMeasurementOptions(tempMeasurementOptions)
  }

  return (
    <Modal
      className={classes.modal}
      onClose={() => onClose()}
      open
    >
      <Card className={classes.modalCard}>
        <form onSubmit={handleSubmit}>
          <CardContent className={classes.modalCardContent}>
            <TextField
              required
              type="text"
              name="name"
              key="inputUseCase"
              placeholder="Use Case Name"
              label="Use Case Name"
              value={name}
              onChange={handleChange}
              variant="outlined"
              size="small"
              autoFocus
            />

            <TextField
              required
              type="text"
              key="inputUseCasePinCode"
              name="pinCode"
              placeholder="Use Case Pin Code"
              label="Use Case Pin Code"
              className={classes.inputField}
              value={pinCode}
              onChange={handleChange}
              error={errorMessage}
              variant="outlined"
              size="small"
            />

            <Typography variant="subtitle1" >Measurement Options</Typography>
            {measurementOptions && measurementOptions.length > 0 && measurementOptions.map(function (element, index) {
              return (
                <FormGroup key={`formgroup-${index}`} className={classes.formGroup}>
                  <TextField
                    required
                    type="text"
                    key={`input-optionGroup-${index}`}
                    placeholder="Option group name"
                    label="Option group name"
                    value={element.name}
                    onChange={(evt) => handleOptionGroupName(index, evt)}
                    variant="outlined"
                    size="small"
                  />

                  <div>
                    <MeasurementOptions
                      id={index}
                      name={element.name}
                      options={element.options}
                      handleOptionChange={handleOptionChange}
                    />
                    <Button
                      size="small"
                      color="primary"
                      className={classes.button}
                      onClick={handleRemoveOptionGroup(index)}
                    >
                      <DeleteIcon />Remove Option Group
                    </Button>

                    <Button
                      size="small"
                      color="primary"
                      className={classes.button}
                      onClick={handleCopyOptionGroup(index)}
                    >
                      <FileCopyIcon />Copy Option Group
                    </Button>
                  </div>
                </FormGroup>
              )
            })}
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" type="submit"><SaveAltIcon />Save</Button>
            <Button size="small" color="primary" onClick={handleAddOptionGroup}><AddIcon />Add Option Group</Button>
            <Button size="small" onClick={onClose}><ClearIcon />Cancel</Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
}

export default withStyles(styles)(UseCaseditor);
