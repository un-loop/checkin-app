import * as React from 'react';
import {DialogContent, DialogActions, Grid} from '@material-ui/core';
import {ValidatorForm} from 'react-material-ui-form-validator';
import IconButton from '../widgets/IconButton';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  content: {
    minWidth: 220,
    [theme.breakpoints.down('sm')]:
    {
      padding: theme.spacing.unit,
      '&:first-child': {
        paddingTop: theme.spacing.unit,
      },
    },
    [theme.breakpoints.up('sm')]:
    {
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
      '&:first-child': {
        paddingTop: theme.spacing.unit * 2,
      },
    },
  },
  fieldSet: {
    padding: 0,
    margin: 0,
    border: 'none',
  },
});

class DialogForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {disabled, classes, actions, ...props} = this.props;

    if (!props.onSubmit) {
      props.onSubmit = (e) => {
        e.nativeEvent.target.submit();
      };
    }

    return (
      <ValidatorForm {...props}>
        <fieldset disabled={disabled} className={classes.fieldSet}>
          <DialogContent className={classes.content}>
            <Grid container
              direction='column'
              justify='center'
              alignItems='flex-start'>
              {this.props.children}
            </Grid>
          </DialogContent>
          {actions &&
              <DialogActions>
                {actions.map(
                    ({callback, label, color, formAction,
                      loading, disabled: actionDisabled},
                    index) =>
                      <IconButton type={formAction}
                        key={index}
                        disabled={disabled || actionDisabled}
                        loading={loading}
                        onClick={formAction ? null : callback }
                        color={color}>
                        {label}
                      </IconButton>
                )}
              </DialogActions>
          }
        </fieldset>
      </ValidatorForm>
    );
  }
}

DialogForm.propTypes = {
  disabled: PropTypes.bool,
  actions: PropTypes.arrayOf( PropTypes.shape({
    callback: PropTypes.func,
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
    formAction: PropTypes.string,
    loading: PropTypes.bool,
  })),
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    fieldSet: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(DialogForm);
