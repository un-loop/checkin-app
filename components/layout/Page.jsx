import * as React from "react";
import { withStyles, CssBaseline, Toolbar, Typography, AppBar, Grid, Avatar, Link, Menu, MenuItem } from "@material-ui/core";
import PropTypes from 'prop-types';
import { LogoColor, SmallLogo, LogoType } from "../widgets/Logo"
import Tooltip from "../widgets/Tooltip";
import { withUserContext } from "../providers/UserContextProvider";

const styles = (theme) => ({
    layout: {
        width: "auto",
        maxWidth: 1400,
        margin: "auto",
        color: theme.palette.common.black
    },
    headerText: {
        display: "inline"
    },
    link: {
        color: theme.palette.common.white,
        fontSize: ".75em",
        fontWeight: 600,
        cursor: "pointer"
    },
    avatar: {
        backgroundColor: theme.palette.secondary.light,
        cursor: "pointer"
    }
});

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showManageAccount: false }
        this.avatarClick = this.avatarClick.bind(this);
        this.menuClose = this.menuClose.bind(this);
        this.menuClick = this.menuClick.bind(this);
    }

    avatarClick(e) {
        e.preventDefault();
        this.setState({anchorEl: e.target});
    }

    menuClose() {
        this.setState({anchorEl: null});
    }

    menuClick() {

    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <CssBaseline />
                <AppBar position="static" color={"primary"}>
                    <Toolbar>
                        <Grid container alignItems="center" justify="space-between">
                            <Grid item>
                                <Grid container alignItems="center" justify="flex-start">
                                    <SmallLogo
                                        color={LogoColor.White}
                                        type={LogoType.Mark}
                                    />
                                    <Typography className={classes.headerText} variant="h6" color="inherit" noWrap>
                                        <span>{this.props.title}</span>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center" justify="flex-end" spacing={8}>
                                    <Tooltip title="Perform admin functions">
                                        <Grid item>
                                            <Link href="/admin" className={classes.link}>Administration</Link>
                                        </Grid>
                                    </Tooltip>
                                    <Tooltip title="Your Account"
                                             canOpen={!Boolean(this.state.anchorEl)}>
                                        <Grid item>
                                            <Avatar onClick={this.avatarClick} className={classes.avatar}>{this.props.user.name}</Avatar>
                                            <Menu
                                                anchorEl={this.state.anchorEl}
                                                open={Boolean(this.state.anchorEl)}
                                                onClose={this.menuClose}
                                                >
                                                <MenuItem onClick={this.menuClick}>Profile</MenuItem>
                                                <MenuItem onClick={this.menuClick}>My account</MenuItem>
                                                <MenuItem onClick={this.menuClick}>Logout</MenuItem>
                                            </Menu>
                                        </Grid>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <div className={classes.layout}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const StyledPage = withUserContext(withStyles(styles)(Page));


StyledPage.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
}

export default StyledPage;
