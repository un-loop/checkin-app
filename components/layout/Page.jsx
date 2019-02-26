import * as React from "react";
import { withStyles, CssBaseline, Toolbar, Typography, AppBar } from "@material-ui/core";
import PropTypes from 'prop-types';
import { LogoColor, SmallLogo, LogoType } from "../widgets/Logo"

const styles = (theme) => ({
    layout: {
        width: "auto",
        maxWidth: 1400,
        margin: "auto"
    }
});

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <CssBaseline />
                <AppBar position="static" color={"primary"}>
                    <Toolbar>
                        <SmallLogo
                            color={LogoColor.White}
                            type={LogoType.Mark}
                        />
                        <Typography variant="h6" color="inherit" noWrap>
                            <span>{this.props.title}</span>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className={classes.layout}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const StyledPage = withStyles(styles)(Page);


StyledPage.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
}

export default StyledPage;
