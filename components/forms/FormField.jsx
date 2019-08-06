import * as React from 'react';
import PropTypes from 'prop-types';
import {Grid} from '@material-ui/core';

const FormField = (props) =>
  <Grid item>
    {props.children}
  </Grid>;

FormField.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormField;
