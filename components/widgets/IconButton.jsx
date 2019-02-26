import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const styles = (theme) => ({
    icon: {
        marginLeft: Math.floor(theme.spacing.unit / 4),
        fontSize: "small"
    }
})

const iconButton = (props) => {
    const {classes, icon: Icon, ...remainder} = props;
    return <Button {...remainder}>
                {props.children}
                <Icon className={classes.icon}/>
            </Button>
}

export default withStyles(styles)(iconButton)
