import * as React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Collapse, ButtonBase } from "@material-ui/core";
import selectable from "../HOCs/selectable";
import InlineIconButton from "../widgets/InlineIconButton";

const styles = (theme) => ({
    link: {
        color: theme.palette.primary.main
    },
    icon: {
        fontSize: "1em",
        marginLeft: theme.spacing.unit
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
            const { link, Icon, label, children, isEditing, onLinkClick, classes, ...remaining } = this.props;

            return (
                <div {...remaining}>
                    <Collapse timeout="auto" in={isEditing} >
                        {children}
                    </Collapse>
                    {!isEditing && link &&
                        <ButtonBase onClick={onLinkClick}>
                            <Typography variant="body2" component="span" className={classes.link}>
                                {link}
                            </Typography>
                        </ButtonBase>
                    }
                    {!isEditing && Icon &&
                        <Typography variant="body2" component="span">
                            {label}
                            <InlineIconButton aria-label="edit"
                                                  onClick={onLinkClick}
                                                  className={clsx(classes.icon)}
                                                  Icon={Icon}
                                                  color="primary" />
                        </Typography>
                    }
                </div>
            )
    }
}

export default selectable(withStyles(styles)(InlineEditor));
