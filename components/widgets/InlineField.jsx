import * as React from 'react';
import {withStyles} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import PropTypes from 'prop-types';
import {TextValidator} from 'react-material-ui-form-validator';
import InlineIconButton from '../widgets/InlineIconButton';

const styles = (theme) => ({
  field: {
    fontSize: '.75rem',
  },
});

const InlineField = (props) => {
  const {classes, cancel, save, ...remaining} = props;

  return (
    <TextValidator
      {...remaining}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <InlineIconButton aria-label='cancel edit'
              onClick={save}
              Icon={DoneIcon}
              color='primary' />
            <InlineIconButton aria-label='cancel edit'
              onClick={cancel}
              Icon={ClearIcon}
              color='secondary' />

          </InputAdornment>
        ),
        disableUnderline: true,
        classes: {
          input: classes.field,
        },
      }}
    />
  );
};

InlineField.propTypes = {
  name: PropTypes.string.isRequired,
  cancel: PropTypes.func,
  save: PropTypes.func,
  classes: PropTypes.shape({
    field: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(InlineField);
