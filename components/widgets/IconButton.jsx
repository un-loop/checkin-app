import * as React from "react";
import classnames from "classnames"
import { withStyles } from "@material-ui/core/styles";
import { Button, Fade } from "@material-ui/core";
import Progress from "./Progress"
import selectable from '../HOCs/selectable';


const styles = (theme) => ({
    icon: {
        marginLeft: Math.floor(theme.spacing.unit / 4),
        fontSize: "small"
    },
    container: {
        display: "inline-block",
        position: "relative"
    }
})

const iconButton = (props) => {
    let {classes, loading, className, icon: Icon, ...remainder} = props;
    className = classnames(className, props.classes.container);

    return <div className={className}>
                <Button {...remainder}>
                    {props.children}
                    {Icon && <Icon className={classes.icon}/>}
                    <Fade
                        in={loading}
                        style={{
                            transitionDelay: loading ? '800ms' : '0ms',
                        }}
                        unmountOnExit
                    >
                        <Progress size={16} variant="overlay" />
                    </Fade>
                </Button>
            </div>
}

export default selectable(withStyles(styles)(iconButton))
