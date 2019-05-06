import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import selectable from '../HOCs/selectable';
import { ButtonBase } from "@material-ui/core";

const styles = (theme) => ({
    root: {
        color: theme.palette.primary.main
    }
});

const ButtonLink = (props) => {
    const { children, classes, ...remaining } = props;

    return (
        <div className={classes.root}>
        <ButtonBase {...remaining}>
            {children}
        </ButtonBase>
        </div>
    );
}

export default selectable(withStyles(styles)(ButtonLink));
