import * as React from 'react';
import {withStyles, Paper, Typography} from '@material-ui/core';
import ErrorMessage from '../widgets/ErrorMessage';
import PropTypes from 'prop-types';

const style = (theme) => ({
  layout: {
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      borderRadius: 0,
      padding: theme.spacing.unit,
    },
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing.unit * 4,
      padding: theme.spacing.unit * 4,
    },
  },
  title: {
    marginBottom: theme.spacing.unit,
  },
});

const Section = (props) => {
  const {classes} = props;
  return (
    <Paper className={classes.layout}>
      { props.error ?
          <ErrorMessage key={props.error.errorKey} retry={props.error.retry}>
            <span>{props.error.message}</span>
          </ErrorMessage>
      : null
      }
      { props.title &&
          <Typography variant='h2' className={classes.title}>
            {props.title}
          </Typography>
      }
      {props.children}
    </Paper>
  );
};

Section.propTypes = {
  error: PropTypes.shape({
    errorKey: PropTypes.any.isRequired,
    message: PropTypes.string.isRequired,
    retry: PropTypes.bool.isRequired,
  }),
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    layout: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  title: PropTypes.string.isRequired,
};

export default withStyles(style)(Section);
