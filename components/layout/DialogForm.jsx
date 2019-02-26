import * as React from "react";
import { DialogContent, DialogActions, Button, Grid } from "@material-ui/core";
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';

const styles = (theme) => ({
    content: {
        minWidth:270,
        [theme.breakpoints.down("sm")]:
        {
            padding: theme.spacing.unit,
            "&:first-child": {
                paddingTop: theme.spacing.unit
            },
        },
        [theme.breakpoints.up("sm")]:
        {
            padding: theme.spacing.unit * 2,
            "&:first-child": {
                paddingTop: theme.spacing.unit * 2
            }
        },
    },
    fieldSet: {
        padding: 0,
        margin: 0,
        border: "none"
    }
});

class DialogForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {disabled, classes, ...props} = this.props;
        return (
            <ValidatorForm {...props}>
                <fieldset disabled={disabled} className={classes.fieldSet}>
                    <DialogContent className={classes.content}>
                        <Grid container
                              direction="column"
                              justify="center"
                              alignItems="flex-start">
                            {this.props.children}
                        </Grid>
                    </DialogContent>
                    {props.actions &&
                        <DialogActions>
                            {props.actions.map( ({callback, label, color, formAction}, index) =>
                                <Button type={formAction} key={index} disabled={disabled} onClick={formAction ? null : callback } color={color}>
                                    {label}
                                </Button>
                            )}
                        </DialogActions>
                    }
                </fieldset>
            </ValidatorForm>
        );
    }
}

DialogForm.propTypes = {
    children: PropTypes.node.isRequired
};

export default withStyles(styles)(DialogForm);
