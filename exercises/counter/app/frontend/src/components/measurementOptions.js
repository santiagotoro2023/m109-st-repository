import React, { useEffect, useState } from 'react';
import {
  TextField,
  withStyles,
  Button,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  iconLabel: {
    display: "inline"
  },
  options: {
    marginTop: theme.spacing(1.5)
  }
});

// Definition of Icons which can be used for buttons
// source https://material.io/resources/icons/?icon=arrow_downward&style=baseline
const ICONS = ["", "arrow_back", "arrow_forward", "arrow_upward", "arrow_downward",
  "swap_horiz", "swap_vert", "accessible", "commute", "flight_land",
  "flight_takeoff", "work", "login", "logout", "pedal_bike", "directions_walk",
  "directions_car", "directions_bus", "directions_railway", "tram", "electric_bike",
  "electric_car", "local_taxi", "electric_scooter", "two_wheeler", "north_east", "north_west",
  "south_east", "south_west", "child_friendly", "elderly", "skateboarding"]

function MeasurementOptions(props) {
  const { classes } = props;

  const [options, setOptions] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState(0);

  useEffect(() => {
    setOptions(props.options);
    setName(props.name);
    setId(props.id);
  }, [props.options, props.name, props.id]);

  // updates the measurement option on the given index with the given event value
  const handleMeasurementOptionChange = idx => evt => {
    const { handleOptionChange } = props
    const newOptions = options.map((option, sidx) => {
      if (idx !== sidx) return option

      // check which information has been updated, either option name or option icon
      if (evt.target.name === "optionName") {
        return { name: evt.target.value, icon: option.icon }
      } else {
        return { name: option.name, icon: evt.target.value }
      }
    });

    setOptions(newOptions);

    // execute parent function in usecaseEditor
    handleOptionChange(id, newOptions);
  };

  // add measurement option
  const handleAddMeasurementOption = () => {
    setOptions(options.concat([{ name: "", icon: "" }]));
  };

  // remove measurement option
  const handleRemoveMeasurementOption = idx => () => {
    const { handleOptionChange } = props
    let tempOptions = options.filter((s, sidx) => idx !== sidx)

    setOptions(tempOptions);

    // update parent state
    handleOptionChange(id, tempOptions)
  }

  return (
    <div>
      {options.map((option, idx) => (
        <div className={classes.options} key={`div-${idx + 1}`}>
          <TextField
            required
            key={idx + 1}
            name="optionName"
            type="text"
            label="Option name"
            placeholder={`Option #${idx + 1} name`}
            value={option.name}
            onChange={handleMeasurementOptionChange(idx)}
            variant="outlined"
            size="small"
          />

          <InputLabel id="labelIconOption" className={classes.iconLabel}>Icon</InputLabel>
          <Select
            labelId="labelIconOption"
            name="optionIcon"
            id="optionIcon"
            value={option.icon}
            onChange={handleMeasurementOptionChange(idx)}
          >
            {
              ICONS.map((icon, i) => (
                <MenuItem key={i} value={icon}>
                  {<Icon>{icon}</Icon>}
                </MenuItem>
              ))
            }
          </Select>

          <Button
            size="small"
            color="primary"
            type="button"
            onClick={handleRemoveMeasurementOption(idx)}
          >
            <DeleteIcon /> Remove Option
          </Button>

          <Button
            size="small"
            color="primary"
            type="button"
            onClick={handleAddMeasurementOption}
          >
            <AddIcon /> Add Option
          </Button>
        </div>
      ))}
    </div>
  )
}

export default withStyles(styles)(MeasurementOptions);
