import * as React from 'react';
import {ButtonBase} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import selectable from '../HOCs/selectable';


const styles = (theme) => ({
  root: {
    color: theme.palette.primary.main,
  },
});

const ButtonLink = (props) => {
  const {children, classes, ...remaining} = props;

  return (
    <div className={classes.root}>
      <ButtonBase {...remaining}>
        {children}
      </ButtonBase>
    </div>
  );
};

ButtonLink.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
};

export default selectable(withStyles(styles)(ButtonLink));
