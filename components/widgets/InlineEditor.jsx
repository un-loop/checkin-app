import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Collapse, ButtonBase } from "@material-ui/core";
import selectable from '../HOCs/selectable'


const styles = (theme) => ({
    link: {
        color: theme.palette.primary.main
    }
});

class InlineEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    handleExit(node) {
        node.style.display = "none";
    }

    render() {
            const { link, children, isEditing, onLinkClick, classes, ...remaining } = this.props;

            return (
                <div {...remaining}>
                    <Collapse timeout="auto" in={isEditing} >
                        {children}
                    </Collapse>
                    {!isEditing &&
                        <ButtonBase onClick={onLinkClick}>
                            <Typography variant="body2" component="span" className={classes.link}>
                                {link}
                            </Typography>
                        </ButtonBase>
                    }
                </div>
            )
    }
}

export default selectable(withStyles(styles)(InlineEditor));
