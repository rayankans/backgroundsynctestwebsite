import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import {registerSync} from './sync-manager';

/** @enum {string} */
const SyncActions = {
  SUCCESS: 'success',
  REJECT: 'reject',
  TIMEOUT: 'timeout',
};

const useStyles = makeStyles(theme => ({
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  checkbox: {
    alignSelf: 'start',
    flex: '1 0 auto',
  },
  icon: {
    alignSelf: 'end',
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

  function showNotification(event) {
    handleChange({target: {name: 'showNotification', value: event.target.checked}});
    if (event.target.checked && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  function addAttempt() {
    props.update(oldAttempts => {
      const attempts = [...oldAttempts];
      attempts.splice(props.index, 0, {
        action: SyncActions.SUCCESS,
        delayMs: 0,
        showNotification: false,
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
        <FormControlLabel
          control={
            <Checkbox
              checked={props.attempt.showNotification}
              onChange={showNotification}
              color="primary"
              inputProps={{
                name: 'showNotification',
                id: 'shownotif',
              }}
            />
          }
          className={classes.checkbox}
          label="Show Notification"
        />
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
    showNotification: false,
  }]);

  const [snackMessage, setSnackMessage] = React.useState(null);

  async function handleClick() {
    const tag = document.getElementById('registration-tag').value ||
                document.getElementById('registration-tag').placeholder;
    try {
      await registerSync(tag, attempts);
      setSnackMessage('Successfully registered sync');
    } catch (e) {
      setSnackMessage('Error: ' + e.message);
    }
  }

  const Icon = snackMessage && snackMessage.startsWith('Error: ') ? ErrorIcon : CheckCircleIcon;
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Registration Tag
      </Typography>
      <TextField
        id="registration-tag"
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
        <Button variant="contained" color="primary"
                style={{margin: theme.spacing(4, 1, 4, 1), flex: '0 1 100%'}}
                onClick={handleClick}
        >
          Create Registration
        </Button>
      </div>

      <div style={{display: 'flex', alignItems: 'center', verticalAlign: 'center', paddingBottom: theme.spacing(2)}}>
        <WarningIcon style={{marginRight: theme.spacing(1)}} />
        <Typography variant="body2" noWrap style={{fontSize: 14}}>
          Unspecified attempts will default to success.
        </Typography>
      </div>
      <div style={{display: 'flex', alignItems: 'center', verticalAlign: 'center'}}>
        <WarningIcon style={{marginRight: theme.spacing(1)}} />
        <Typography variant="body2" noWrap style={{fontSize: 14}}>
          Large timeouts might cause race conditions.
        </Typography>
      </div>
        
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(snackMessage)}
        onClose={() => setSnackMessage(null)}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        autoHideDuration={4000}
        message={
          <span id="message-id" style={{display: 'flex', alignItems: 'center'}}>
            <Icon style={{marginRight: theme.spacing(1)}}/>
            {snackMessage}
          </span>}
      />
      
    </>
  );
}
