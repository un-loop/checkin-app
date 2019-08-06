import * as React from 'react';
import {Tooltip} from '@material-ui/core';
import PropTypes from 'prop-types';

class CustomTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onOpen(e) {
    e.preventDefault();
    this.setState({open: true});

    this.props.onOpen && this.props.onOpen(e);
  }

  onClose(e) {
    e.preventDefault();
    this.setState({open: false});

    this.props.onClose && this.props.onClose(e);
  }

  render() {
    let {children, open, enterDelay, leaveDelay, canOpen, ...remainder} =
      this.props;
    delete remainder.onClose;
    delete remainder.onOpen;

    if (enterDelay === undefined) enterDelay = 500;
    if (leaveDelay === undefined) leaveDelay = 200;

    let calculatedOpen = open !==undefined ? open : this.state.open;
    if (canOpen !== undefined) {
      calculatedOpen = calculatedOpen && Boolean(this.props.canOpen);
    }

    return (
      <Tooltip
        {...remainder}
        open={calculatedOpen}
        onOpen={this.onOpen}
        onClose={this.onClose}
        enterDelay={enterDelay}
        leaveDelay={leaveDelay}>
        {children}
      </Tooltip>
    );
  }
}

CustomTooltip.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,
  canOpen: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default CustomTooltip;
