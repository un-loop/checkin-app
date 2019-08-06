import * as React from 'react';
import {SwipeableDrawer, withStyles, Typography} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import classnames from 'classnames';
import {withUserContext} from '../providers';
import PropTypes from 'prop-types';
import selectable from '../HOCs/selectable';
import InlineEditor from '../widgets/InlineEditor';
import InlineError from '../layout/InlineError';
import ChangePasswordForm from '../forms/ChangePasswordForm';
import ChangeEmailForm from '../forms/ChangeEmailForm';
import ChangeNameForm from '../forms/ChangeNameForm';

import axios from 'axios';

const styles = (theme) => ({
  root: {
    [`& ${ProfileSection} + ${ProfileSection}`]: {
      paddingTop: theme.spacing.unit * 4,
    },
    [`& ${InlineEditor}`]: {
      display: 'block',
    },
    [`& ${InlineEditor} + ${InlineEditor}`]: {
      paddingTop: theme.spacing.unit,
    },
  },
});

const profileStyles = (theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing.unit * 2,
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing.unit * 5,
      paddingRight: theme.spacing.unit * 5,
      paddingTop: theme.spacing.unit * 4,
      paddingBottom: theme.spacing.unit * 4,
    },
  },
});

const errorStyles = (theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: -theme.spacing.unit * 2,
      marginRight: -theme.spacing.unit * 2,
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: -theme.spacing.unit * 5,
      marginRight: -theme.spacing.unit * 5,
    },
  },
});

const FullWidthError = withStyles(errorStyles)(InlineError);

const ProfileSection = selectable(withStyles(profileStyles)( (props) => {
  const {title, children, classes, className, ...remaining} = props;

  return (
    <div className={classnames(classes.root, className)} {...remaining}>
      <Typography variant='h4'>
        {title}
      </Typography>
      <Typography variant='body2' component='div'>
        {children}
      </Typography>
    </div>
  );
}));

const refs = {};
class ProfileDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPasswordEditor: false,
      showEmailEditor: false,
      showNameEditor: false,
      passwordSaveError: null,
      emailSaveError: null,
      nameSaveError: null,
    };

    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
  }

  onChangePassword(data) {
    delete data.confirm;
    return axios.post('/account/changePassword/', data)
        .then(() => this.setState({showPasswordEditor: false}))
        .then( () => true,
            (ex) => {
              const message = ex.request.status === 403 ?
                'Invalid credentials' : ex.message;
              this.setState({
                passwordSaveError: {
                  message: message,
                  errorKey: Date.now(),
                },
              });
              return false;
            }
        );
  }

  onChangeEmail(data) {
    delete data.confirm;
    return axios.post('/account/changeAccountDetails/', data)
        .then(() => this.setState({showEmailEditor: false}))
        .then(() => axios.post('/account/refreshUserContext'),
            (ex) => {
              const message = ex.request.status === 403 ?
                'Invalid credentials' : ex.message;
              this.setState({
                emailSaveError: {
                  message: message,
                  errorKey: Date.now(),
                },
              });
            }
        )
        .then(() => this.props.user.setUser());
  }

  onChangeName(data) {
    const userId = this.props.user.userId;
    axios.put(`/api/users/${userId}/profiles/${userId}`, data)
        .then(() => this.setState({showNameEditor: false}))
        .then(() => axios.post('/account/refreshUserContext'),
            (ex) => {
              const message = ex.request.status === 403 ?
                'Invalid credentials' : ex.message;
              this.setState({
                nameSaveError: {
                  message: message,
                  errorKey: Date.now(),
                },
              });
            }
        )
        .then(() => this.props.user.setUser());
  }

  render() {
    const toggleFlag = (flag, value) => {
      this.setState({[flag]: value});
    };

    const showEditor = (editor, ref) => () => {
      toggleFlag(`show${editor}`, true);
      refs[editor].focus();
    };

    const hideEditor = (editor) =>
      toggleFlag.bind(this, `show${editor}`, false);

    let {user, className, ...remaining} =
      this.props; // note that classes is pushed into remaining
    className = classnames(className, this.props.classes.root);

    return (
      <SwipeableDrawer className={className} {...remaining}>
        <ProfileSection title='Account'>
          <InlineEditor link='change password'
            onLinkClick={showEditor('PasswordEditor')}
            isEditing={this.state.showPasswordEditor} >
            <FullWidthError error={this.state.passwordSaveError} />
            <ChangePasswordForm onCancel={hideEditor('PasswordEditor')}
              onSave={this.onChangePassword}
              inputRef={
                (ref) => {
                  refs['PasswordEditor'] = ref;
                }}/>
          </InlineEditor>
          <InlineEditor link='change email'
            onLinkClick={showEditor('EmailEditor')}
            isEditing={this.state.showEmailEditor} >
            <FullWidthError error={this.state.emailSaveError} />
            <ChangeEmailForm onCancel={hideEditor('EmailEditor')}
              onSave={this.onChangeEmail}
              inputRef={
                (ref) => {
                  refs['EmailEditor'] = ref;
                }}/>
          </InlineEditor>
        </ProfileSection>
        <ProfileSection title='Profile'>
          <InlineEditor Icon={CreateIcon}
            label={user.name}
            onLinkClick={showEditor('NameEditor')}
            isEditing={this.state.showNameEditor} >
            <FullWidthError error={this.state.nameSaveError} />
            <ChangeNameForm onCancel={hideEditor('NameEditor')}
              onSave={this.onChangeName}
              name={user.name}
              inputRef={
                (ref) => {
                  refs['NameEditor'] = ref;
                }} />
          </InlineEditor>
        </ProfileSection>
      </SwipeableDrawer>
    );
  }
}

ProfileDrawer.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    setUser: PropTypes.func.isRequired,
  }).isRequired,
  className: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }),
};

export default withStyles(styles)(withUserContext(ProfileDrawer));
