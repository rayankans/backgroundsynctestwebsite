import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

/** @enum {string} */
const SyncActions = {
  SUCCESS: 'success',
  REJECT: 'reject',
  TIMEOUT: 'timeout',
};

const useStyles = makeStyles(theme => ({
  buttonGroup: {
    textAlign: 'right',
  },
  button: {
    margin: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));


function SyncAttempt(props) {
  const classes = useStyles();
  const theme = useTheme();

  function handleChange(event) {
    props.update(oldAttempts => {
      const attempts = [...oldAttempts];
      attempts[props.index-1] = {
        ...oldAttempts[props.index-1],
        [event.target.name]: event.target.value,
      };
      return attempts;
    });
  }

  function addAttempt() {
    props.update(oldAttempts => {
      const attempts = [...oldAttempts];
      attempts.splice(props.index, 0, {
        action: SyncActions.SUCCESS,
        delayMs: 0,
      });
      return attempts;
    });
  }

  function deleteAttempt() {
    props.update(oldAttempts => oldAttempts.filter((_, i) => i !== props.index -1));
  }

  return (
    <>
      <Typography variant="subtitle2" gutterBottom>
          Attempt #{props.index}
      </Typography>

      <FormControl style={{width: '100%', marginBottom: theme.spacing(2)}}>
        <InputLabel htmlFor="action">sync event action (result)</InputLabel>
        <Select
          value={props.attempt.action}
          onChange={handleChange}
          inputProps={{
            name: 'action',
            id: 'action',
          }}
        >
          <MenuItem value={SyncActions.SUCCESS}>Succeed</MenuItem>
          <MenuItem value={SyncActions.REJECT}>Reject</MenuItem>
          <MenuItem value={SyncActions.TIMEOUT}>Timeout</MenuItem>
        </Select>
      </FormControl>
      
      {(props.attempt.action !== SyncActions.TIMEOUT) &&
      <FormControl style={{width: '100%', marginBottom: theme.spacing(2)}}>
        <InputLabel htmlFor="delay">delay before result (ms)</InputLabel>
        <Select
          value={props.attempt.delayMs}
          onChange={handleChange}
          inputProps={{
            name: 'delayMs',
            id: 'delay',
          }}
        >
          <MenuItem value={0}>Immediate</MenuItem>
          <MenuItem value={1000}>1 second</MenuItem>
          <MenuItem value={30000}>30 seconds</MenuItem>
          <MenuItem value={60000}>1 minute</MenuItem>
          <MenuItem value={120000}>2 minutes</MenuItem>
        </Select>
      </FormControl>}
      <div className={classes.buttonGroup}>
        <IconButton aria-label="add" className={classes.icon} onClick={addAttempt}>
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="delete" className={classes.icon} disabled={props.index===1} onClick={deleteAttempt}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    </>
  );
}

export default function CreationForm() {
  const theme = useTheme();

  const [attempts, setAttempts] = React.useState([{
    action: SyncActions.SUCCESS,
    delayMs: 0,
  }]);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Registration Tag
      </Typography>
      <TextField
        id="standard-full-width"
        style={{ margin: 8 }}
        placeholder={`tag-${Date.now()}`}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div style={{paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2)}} />
      <Typography variant="h5" gutterBottom>
        Sync Attempts
      </Typography>
      {attempts.map((attempt, i) => <SyncAttempt attempt={attempt} key={i} index={i+1} update={setAttempts} />)}

      <div style={{width: '100%', display: 'flex'}}>
        <Button variant="contained" color="primary" style={{margin: theme.spacing(4, 1, 1, 1), flex: '0 1 100%'}}>
          Create Registration
        </Button>
      </div>
    </>
  );
}
