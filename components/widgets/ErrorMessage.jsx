import * as React from "react";
import { withStyles } from "@material-ui/core";
import Dismiss from "@material-ui/icons/HighlightOff";
import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';

const style = (theme) => ({
    error: {
        padding: theme.spacing.unit,
        color: theme.palette.error.dark,
        backgroundColor: theme.palette.error.light,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    errorContained: {
        "& > div": {
            borderWidth: 2,
            borderRadius: 5,
            borderStyle: "solid",
            borderColor: theme.palette.error.dark
        },
        marginBottom: theme.spacing.unit
    },
    errorFull: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});

class ErrorMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {dismissed: false};
    }

    onDismiss() {
        this.setState({dismissed: true});
    }

    render() {
        const { classes, variant } = this.props;

        return (
                <Collapse in={!this.state.dismissed} className={variant && variant.toLowerCase() == "full" ? classes.errorFull : classes.errorContained} >
                    <div className={classes.error}>
                        <span>
                            <strong>
                                Error: {this.props.children}
                            </strong>
                        </span>
                        <Dismiss
                            onClick={ this.onDismiss.bind(this) }
                        />
                    </div>
                </Collapse>
        );
    }
}

ErrorMessage.propTypes = {
    children: PropTypes.node.isRequired
}

export default withStyles(style)(ErrorMessage);
