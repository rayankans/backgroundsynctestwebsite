import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import CreationForm from './CreationForm';
import TopAppBar from './TopAppBar';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3, 2),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <>
      <TopAppBar />
      <Container maxWidth="sm">
        <Paper className={classes.root}>
          <CreationForm />
        </Paper>
      </Container>
    </>
  );
}

export default App;
