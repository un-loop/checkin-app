import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import ErrorMessage from "../widgets/ErrorMessage";
import selectable from "../HOCs/selectable";

const styles = (theme) => ({
    root: {
        backgroundColor: theme.palette.error.light,
        [theme.breakpoints.down("sm")]:
        {
            padding: theme.spacing.unit
        },
        [theme.breakpoints.up("sm")]:
        {
            padding: theme.spacing.unit * 2
        },
        position: "relative",
        height: 60,
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    }
});

class InlineError extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dismissed: false};
        this.onDismissUpdate = this.onDismissUpdate.bind(this);
    }

    onDismissUpdate(value) {
        this.setState({dismissed: value});
    }

    render() {
        return this.props.error ?
            <Collapse in={!this.state.dismissed}>
                <div className={this.props.classes.root}>
                    <ErrorMessage key={this.props.error.errorKey} retry={this.props.error.retry}
                    onDismissUpdate={this.onDismissUpdate} variant="full" >
                        <span>
                            {this.props.error.message}
                        </span>
                    </ErrorMessage>
                </div>
            </Collapse>
        : null;
    }

}

InlineError.propTypes = {
    error: PropTypes.shape({
        message: PropTypes.string.isRequired,
        errorKey: PropTypes.any.isRequired,
        retry: PropTypes.bool
    })
}

export default selectable(withStyles(styles)(InlineError));
