import * as React from 'react';
import {DialogTitle} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ErrorMessage from '../widgets/ErrorMessage';
import selectable from '../HOCs/selectable';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.accent.background,
    [theme.breakpoints.down('sm')]:
    {
      padding: theme.spacing.unit,
    },
    [theme.breakpoints.up('sm')]:
    {
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
    },
    position: 'relative',
  },
});

const DialogErrorTitle = (props) => (
  <DialogTitle className={props.classes.root}>
    { props.error ?
        <ErrorMessage key={props.error.errorKey}
          retry={props.error.retry} variant='full' >
          <span>
            {props.error.message}
          </span>
        </ErrorMessage>
    : null
    }
    {props.children}
  </DialogTitle>
);

DialogErrorTitle.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    errorKey: PropTypes.any.isRequired,
    retry: PropTypes.bool,
  }),
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }),
};

export default selectable(withStyles(styles)(DialogErrorTitle));
