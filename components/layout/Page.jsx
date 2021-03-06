import * as React from 'react';
import {withStyles,
  CssBaseline,
  Toolbar,
  Typography,
  AppBar,
  Grid,
  Avatar,
  Link,
  Menu,
  MenuItem} from '@material-ui/core';
import PropTypes from 'prop-types';
import {LogoColor, SmallLogo, LogoType} from '../widgets/Logo';
import Tooltip from '../widgets/Tooltip';
import {withUserContext} from '../providers/UserContextProvider';
import ProfileDrawer from './ProfileDrawer';

const styles = (theme) => ({
  layout: {
    width: 'auto',
    maxWidth: 1400,
    margin: 'auto',
    color: theme.palette.common.black,
  },
  headerText: {
    display: 'inline',
  },
  link: {
    color: theme.palette.common.white,
    fontSize: '.75em',
    fontWeight: 600,
    cursor: 'pointer',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.light,
    cursor: 'pointer',
  },
});

const getInitials = (name) => {
  if (!name) return '';

  // todo: consider removing jr, sr, III, etc designations
  let initials = name.split(' ')
      .map((n) => n ? n[0] : '');

  if (initials.length > 3) {
    initials = initials[0] + initials[initials.length - 1];
  }

  return initials;
};

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {showManageAccount: false, drawerOpen: false};
    this.menuClick = this.menuClick.bind(this);
  }

  avatar(e) {
    this.setState({anchorEl: e.target});
  }

  close() {
    this.setState({anchorEl: null});
  }

  profile() {
    this.setState({drawerOpen: true, anchorEl: null});
  }

  logout() {
    this.setState({anchorEl: null});
    window.location.href = '/logout';
  }

  menuClick(callback) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      callback.call(this, e);
    };
  }

  render() {
    const {classes, user, title, children, ...props} = this.props;
    return (
      <div {...props}>
        <CssBaseline />
        { user.isLoggedIn &&
            <ProfileDrawer open={this.state.drawerOpen}
              onClose={() => this.setState({drawerOpen: false})}
              onOpen={() => this.setState({drawerOpen: true})} />
        }
        { title &&
          <AppBar position='static' color={'primary'}>
            <Toolbar>
              <Grid container alignItems='center' justify='space-between'>
                <Grid item>
                  <Grid container alignItems='center' justify='flex-start'>
                    <SmallLogo
                      color={LogoColor.White}
                      type={LogoType.Mark}
                    />
                    <Typography className={classes.headerText}
                      variant='h6'
                      color='inherit' noWrap>
                      <span>{title}</span>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container
                    alignItems='center'
                    justify='flex-end'
                    spacing={8}>
                    {user.isAdmin &&
                        <Tooltip title='Perform admin functions'>
                          <Grid item>
                            <Link href='/admin'className={classes.link}>
                              Administration
                            </Link>
                          </Grid>
                        </Tooltip>
                    }
                    {user.isLoggedIn &&
                        <Tooltip title='Your Account'
                          canOpen={!this.state.anchorEl}>
                          <Grid item>
                            <Avatar
                              onClick={this.menuClick(this.avatar)}
                              className={classes.avatar}>
                              {getInitials(user.name)}
                            </Avatar>
                            <Menu
                              anchorEl={this.state.anchorEl}
                              open={Boolean(this.state.anchorEl)}
                              onClose={this.menuClick(this.close)}
                            >
                              <MenuItem onClick={this.menuClick(this.profile)}>
                                Profile
                              </MenuItem>
                              <MenuItem onClick={this.menuClick(this.logout)}>
                                Logout
                              </MenuItem>
                            </Menu>
                          </Grid>
                        </Tooltip>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        }
        <div className={classes.layout}>
          {children}
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    layout: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    headerText: PropTypes.string.isRequired,
  }),
};

const StyledPage = withUserContext(withStyles(styles)(Page));

export default StyledPage;
