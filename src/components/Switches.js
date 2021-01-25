import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Features/ActiveMetrics/sliceReducer';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  container: {
    padding: '10px 20px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
export default function Switches() {
  const classes = useStyles();
  const metricsOptions = [
    { name: 'INJ Valve Open', value: 'injValveOpen' },
    { name: 'Oil Temp', value: 'oilTemp' },
    { name: 'Tubing Pressure', value: 'tubingPressure' },
    { name: 'Flare Temp', value: 'flareTemp' },
    { name: 'Casing Pressure', value: 'casingPressure' },
    { name: 'Water Temp', value: 'waterTemp' },
  ];

  const [metric, setSetMetrics] = React.useState([]);
  const activeArr = useSelector(state => state.activeMetrics.selectedMetrics);

  const handleChange = event => {
    const { value } = event.target;
    const metricName = value ? value[value.length - 1] : null;

    const selectedMetricOption = metricsOptions.filter(i => i.name === metricName);
    const metricValue = selectedMetricOption.length > 0 ? selectedMetricOption[0].value : '';
    setSetMetrics(value);

    if (activeArr.some(metric => metric.metricName === metricValue) || metricValue === '') {
      var updatedMetricValues = [];
      for (var i = 0; i < metricsOptions.length; i++) {
        for (var y = 0; y < value.length; y++) {
          if (metricsOptions[i].name === value[y]) {
            updatedMetricValues.push(metricsOptions[i]);
          }
        }
      }
      var uniqueMetrics = activeArr.filter(item => !updatedMetricValues.some(other => item.metricName === other.value));

      return dispatch(actions.remove(uniqueMetrics[0].metricName));
    } else {
      return dispatch(
        actions.active({
          metricName: metricValue,
          before: timeStamp.current,
          after: timeStamp.past,
        }),
      );
    }
  };

  const timeStamp = useSelector(state => state.heartbeat);
  const dispatch = useDispatch();

  return (
    <div className={classes.container}>
      <h1>Select Metrics</h1>
      <FormControl component="fieldset">
        <FormGroup aria-label="position" row>
          <FormControl className={classes.formControl}>
            <Select
              value={metric}
              onChange={handleChange}
              multiple
              className={classes.selectEmpty}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {metricsOptions.map(option => (
                <MenuItem value={option.name} key={option.value}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>
      </FormControl>
    </div>
  );
}
