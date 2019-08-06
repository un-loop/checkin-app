import {withStyles} from '@material-ui/core';
import * as React from 'react';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  root: {
    fontWeight: 600,
    fontSize: '1.5em',
  },
});

const ReadOnlyField = (props) => {
  const {classes, name, value, ...remainder} = props;

  delete remainder.type;
  return (
    <div className={classes.root}>
      <label htmlFor={name}>
        {value}
      </label>
      <input
        name={name}
        type='hidden'
        value={value}
        {...remainder}
      />
    </div>
  );
};

ReadOnlyField.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }),
};

export default withStyles(styles)(ReadOnlyField);
