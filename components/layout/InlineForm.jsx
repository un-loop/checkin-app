import * as React from "react";
import {  Grid } from "@material-ui/core";
import { ValidatorForm } from 'react-material-ui-form-validator';
import IconButton from "../widgets/IconButton"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';

const styles = (theme) => ({
    content: {
    },
    buttons: {
        [theme.breakpoints.down("sm")]: {
            [`& ${IconButton} + ${IconButton}`]: {
                marginLeft: theme.spacing.unit
            }
        },
        [theme.breakpoints.up("sm")]: {
            [`& ${IconButton} + ${IconButton}`]: {
                marginLeft: Math.round(theme.spacing.unit * 1.5)
            }
        }
    },
    fieldSet: {
        padding: 0,
        margin: 0,
        border: "none"
    }
});

let formRef;

class InlineForm extends React.Component {
    constructor(props) {
        super(props);
    }

    resetValidations() {
        if (formRef) formRef.resetValidations();
    }

    render() {
        const {disabled, classes, actions, ...props} = this.props;

        return (
            <ValidatorForm {...props} ref={(ref) => formRef = ref}>
                <fieldset disabled={disabled} className={classes.fieldSet}>
                    <div className={classes.content}>
                        <Grid container
                              direction="column"
                              justify="center"
                              alignItems="flex-start">
                            {this.props.children}
                        </Grid>
                    </div>
                    {actions &&
                        <div className={classes.buttons}>
                            {actions.map( ({callback, label, color, formAction, loading}, index) =>
                                <IconButton type={formAction} key={index} disabled={disabled} loading={loading} onClick={formAction ? null : callback } color={color}>
                                    {label}
                                </IconButton>
                            )}
                        </div>
                    }
                </fieldset>
            </ValidatorForm>
        );
    }
}

InlineForm.propTypes = {
    children: PropTypes.node.isRequired
};

export default withStyles(styles)(InlineForm);
