import * as React from 'react';
import {Dialog, withMobileDialog} from '@material-ui/core';
import PropTypes from 'prop-types';

class ResponsiveDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {children, ...props} = this.props;
    return (
      <Dialog {...props} maxWidth='xs' >
        {children}
      </Dialog>
    );
  }
}

ResponsiveDialog.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withMobileDialog({breakpoint: 'xs'})(ResponsiveDialog);
