import * as React from "react";
import clsx from "clsx";
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
    icon: {
        cursor: "pointer",
        padding: theme.spacing.unit / 2
    }
});

const inlineIconButton = (props) => {
    const {Icon, classes, color, className, ...remaining} = props;

    return (
        <IconButton {...remaining} className={clsx(classes.icon, className)}>
           <Icon fontSize="small"
                 color={color} />
        </IconButton>
    );
}

inlineIconButton.propTypes = {
    Icon: PropTypes.any.isRequired
}

export default withStyles(styles)(inlineIconButton);
