import * as React from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import InlineForm from '../layout/InlineForm';
import {withUserContext} from '../providers/UserContextProvider';

const defaultState = {
  password: '',
  username: '',
  confirm: '',
};

class ChangeEmailForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    ValidatorForm.addValidationRule('confirmEmail', (value) => {
      return value === this.state.username;
    });

    ValidatorForm.addValidationRule('mustDiffer', (value) => {
      return value !== this.props.user.username;
    });
  }

  handleInputChange(name, value) {
    this.setState({[name]: value});
  }

  save(e) {
    e.preventDefault();
    if (this.props.onSave) {
      this.props.onSave(this.state)
          .then((result) => {
            if (result) {
              this.setState(defaultState);
              this.formRef && this.formRef.resetValidations();
            }
          });
    }
  }

  cancel(e) {
    e.preventDefault();
    this.props.onCancel && this.props.onCancel();
  }

  render() {
    const {saving, inputRef, ...props} = this.props;

    const actions = [
      {
        label: 'change',
        formAction: 'submit',
        color: 'primary',
        loading: saving,
      },
      {
        label: 'cancel',
        formAction: 'reset',
        color: 'primary',
        disabled: saving,
      },
    ];

    delete props.onSave;
    delete props.onCancel;
    props.autoComplete = 'off';
    props.onSubmit = this.save;
    props.onReset = this.cancel;
    props.actions = actions;

    return (
      <InlineForm {...props} innerRef={(ref) => this.formRef = ref }>
        <FormField>
          <TextValidator
            id='email-password'
            name='password'
            label='Current Password'
            onChange={ (e) =>
              this.handleInputChange(e.target.name, e.target.value)}
            margin='dense'
            validators={['required']}
            errorMessages={['enter your password']}
            withRequiredValidator={true}
            value={this.state.password}
            autoComplete='off'
            inputRef={inputRef}
            type='password' />
        </FormField>
        <FormField>
          <TextValidator
            id='email-username'
            name='username'
            label='New Email'
            onChange={ (e) =>
              this.handleInputChange(e.target.name, e.target.value)}
            margin='dense'
            validators={['required', 'mustDiffer', 'isEmail']}
            errorMessages={
              ['enter new email',
                'email same as previous',
                'not a valid email address']}
            withRequiredValidator={true}
            value={this.state.username}
            autoComplete='off' />
        </FormField>
        <FormField>
          <TextValidator
            id='email-confirm'
            name='confirm'
            label='Confirm Email'
            onChange={ (e) =>
              this.handleInputChange(e.target.name, e.target.value)}
            margin='dense'
            validators={['required', 'confirmEmail']}
            errorMessages={['confirm new email', 'email must match']}
            withRequiredValidator={true}
            value={this.state.confirm}
            autoComplete='off'
          />
        </FormField>
      </InlineForm>
    );
  }
}

ChangeEmailForm.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  saving: PropTypes.bool,
  inputRef: PropTypes.oneOf([PropTypes.func, PropTypes.object]),
};

export default withUserContext(ChangeEmailForm);
