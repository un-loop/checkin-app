import * as React from 'react';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  icon: {
    cursor: 'pointer',
    padding: theme.spacing.unit / 2,
  },
});

const inlineIconButton = (props) => {
  const {Icon, classes, color, className, ...remaining} = props;

  return (
    <IconButton {...remaining} className={clsx(classes.icon, className)}>
      <Icon fontSize='small'
        color={color} />
    </IconButton>
  );
};

inlineIconButton.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  Icon: PropTypes.any.isRequired,
  classes: PropTypes.shape({
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(inlineIconButton);
