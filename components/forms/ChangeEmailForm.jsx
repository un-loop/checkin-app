import * as React from "react";
import PropTypes from "prop-types"
import FormField from "./FormField";
import {TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import InlineForm from "../layout/InlineForm";
import {withUserContext} from "../providers/UserContextProvider"

class ChangeEmailForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            password: "",
            username: "",
            confirm: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('confirmEmail', (value) => {
            return value === this.state.username
        });

        ValidatorForm.addValidationRule('mustDiffer', (value) => {
            return value !== this.props.user.username
        });
    }

    handleInputChange(name, value) {
        this.setState({[name]: value});
    }

    save(e) {
        e.preventDefault();
        this.props.onSave && this.props.onSave(this.state);
    }

    cancel(e) {
        e.preventDefault();
        this.props.onCancel && this.props.onCancel();
    }

    render() {
        const {saving, onSave,onCancel, ...props} = this.props;

        const actions = [
            {
                label: "change",
                formAction: "submit",
                color: "primary",
                loading: saving
            },
            {
                label: "cancel",
                formAction: "reset",
                color: "primary",
                disabled: saving
            }
        ];

        props.autoComplete = "off";
        props.onSubmit = this.save;
        props.onReset = this.cancel;
        props.actions = actions;

        return (
            <InlineForm {...props}>
                <FormField>
                    <TextValidator
                            id="password"
                            name="password"
                            label="Current Password"
                            onChange={ (e) => this.handleInputChange(e.target.name, e.target.value)}
                            margin="dense"
                            validators={['required']}
                            errorMessages={['enter your password']}
                            withRequiredValidator={true}
                            value={this.state.password}
                            autoComplete="off"
                            type="password" />
                </FormField>
                <FormField>
                    <TextValidator
                            id="username"
                            name="username"
                            label="New Email"
                            onChange={ (e) => this.handleInputChange(e.target.name, e.target.value)}
                            margin="dense"
                            validators={['required','mustDiffer', 'isEmail']}
                            errorMessages={['enter new email', 'email same as previous', 'not a valid email address']}
                            withRequiredValidator={true}
                            value={this.state.username}
                            autoComplete="off"
                    />
                </FormField>
                <FormField>
                    <TextValidator
                            id="confirm"
                            name="confirm"
                            label="Confirm Email"
                            onChange={ (e) => this.handleInputChange(e.target.name, e.target.value)}
                            margin="dense"
                            validators={['required', 'confirmEmail']}
                            errorMessages={['confirm new email', 'email must match']}
                            withRequiredValidator={true}
                            value={this.state.confirm}
                            autoComplete="off"
                    />
                </FormField>
            </InlineForm>
        );

    }
}

ChangeEmailForm.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired
    })
}

export default withUserContext(ChangeEmailForm);
