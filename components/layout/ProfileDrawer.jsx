import * as React from "react";
import { SwipeableDrawer, withStyles, Typography } from '@material-ui/core';
import classnames from "classnames"
import { withUserContext } from "../providers"
import PropTypes from 'prop-types';
import selectable from '../HOCs/selectable'
import InlineEditor from '../widgets/InlineEditor'
import InlineError from '../layout/InlineError'
import ChangePasswordForm from '../forms/ChangePasswordForm'
import axios from "axios";

const styles = (theme) => ({
    root: {
        [`& ${ProfileSection} + ${ProfileSection}`]: {
            paddingTop: theme.spacing.unit * 4
        },
        [`& ${InlineEditor}`]: {
            display: "block"
        },
        [`& ${InlineEditor} + ${InlineEditor}`]: {
            paddingTop: theme.spacing.unit
        }
    }
});

const profileStyles = (theme) => ({
    root: {
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing.unit * 2
        },
        [theme.breakpoints.up("sm")]: {
            paddingLeft: theme.spacing.unit * 6,
            paddingRight: theme.spacing.unit * 6,
            paddingTop: theme.spacing.unit * 4,
            paddingBottom: theme.spacing.unit * 4
        }
    }
});

const errorStyles = (theme) => ({
    root: {
        [theme.breakpoints.down("sm")]: {
            marginLeft: -theme.spacing.unit * 2,
            marginRight: -theme.spacing.unit * 2
        },
        [theme.breakpoints.up("sm")]: {
            marginLeft: -theme.spacing.unit * 6,
            marginRight: -theme.spacing.unit * 6,
        }
    }
})

const FullWidthError = withStyles(errorStyles)(InlineError);

const ProfileSection = selectable(withStyles(profileStyles)( (props) => {
    const {title, children, classes, className, ...remaining} = props;

    return (
        <div className={classnames(classes.root, className)} {...remaining}>
            <Typography variant="h4">
                {title}
            </Typography>
            <Typography variant="body2" component="div">
                {children}
            </Typography>
        </div>
    )
}));

class ProfileDrawer extends React.Component {

    constructor(props) {
        super(props);

        this.state = { showPasswordEditor: false, saveError: null };
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    onChangePassword(data) {
        axios.post("/account/changePassword/", data)
            .then(() => this.setState({showPasswordEditor: false}))
            .then( () => {
                this.setState({});
            },
            (ex) => {
                let message = ex.request.status === 403 ? "Invalid credentials" : ex.message
                this.setState({
                    saveError: {
                        message: message,
                        errorKey: Date.now()
                    }
                })
            });
    }

    render() {
        const toggleFlag = (flag, value) => () => {
            this.setState({[flag]: value});
            };

        let { user, className, ...remaining } = this.props; //note that classes is pushed into remaining
        className = classnames(className, this.props.classes.root);

        return (
            <SwipeableDrawer className={className} {...remaining}>
                <ProfileSection title="Account">
                    <InlineEditor link="change password" onLinkClick={toggleFlag("showPasswordEditor", true)} isEditing={this.state.showPasswordEditor} >
                        <FullWidthError error={this.state.saveError} />
                        <ChangePasswordForm onCancel={toggleFlag("showPasswordEditor", false)} onSave={this.onChangePassword} />
                    </InlineEditor>
                    <InlineEditor link="change email" />
                </ProfileSection>
                <ProfileSection title="Profile">
                    {user.name}
                </ProfileSection>
            </SwipeableDrawer>
        )
    }
}

ProfileDrawer.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired
    }).isRequired
}

export default withStyles(styles)(withUserContext(ProfileDrawer));