import * as React from 'react';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core/styles';
import {Typography, Collapse, ButtonBase} from '@material-ui/core';
import PropTypes from 'prop-types';
import selectable from '../HOCs/selectable';
import InlineIconButton from '../widgets/InlineIconButton';

const styles = (theme) => ({
  link: {
    color: theme.palette.primary.main,
  },
  icon: {
    fontSize: '1em',
    marginLeft: theme.spacing.unit,
  },
});

class InlineEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  handleExit(node) {
    node.style.display = 'none';
  }

  render() {
    const {link, Icon, label, children,
      isEditing, onLinkClick, classes, ...remaining} = this.props;

    return (
      <div {...remaining}>
        <Collapse timeout='auto'
          in={isEditing}
          mountOnEnter={true}
          unmountOnExit={true} >
          {children}
        </Collapse>
        {!isEditing && link &&
            <ButtonBase onClick={onLinkClick}>
              <Typography
                variant='body2'
                component='span'
                className={classes.link}>
                {link}
              </Typography>
            </ButtonBase>
        }
        {!isEditing && Icon &&
            <Typography variant='body2' component='span'>
              {label}
              <InlineIconButton aria-label='edit'
                onClick={onLinkClick}
                className={clsx(classes.icon)}
                Icon={Icon}
                color='primary' />
            </Typography>
        }
      </div>
    );
  }
}

InlineEditor.propTypes = {
  link: PropTypes.string,
  Icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
  onLinkClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    link: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

export default selectable(withStyles(styles)(InlineEditor));
