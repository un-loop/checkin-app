import * as React from "react";
import FormField from "./FormField";
import {TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import InlineForm from "../layout/InlineForm";

class ChangePasswordForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            password: "",
            newPassword: "",
            confirm: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('confirmPassword', (value) => {
            return value === this.state.newPassword
        });

        ValidatorForm.addValidationRule('mustDiffer', (value) => {
            return value !== this.state.password
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
                            id="newPassword"
                            name="newPassword"
                            label="New Password"
                            onChange={ (e) => this.handleInputChange(e.target.name, e.target.value)}
                            margin="dense"
                            validators={['required','mustDiffer']}
                            errorMessages={['enter new password', 'password same as previous']}
                            withRequiredValidator={true}
                            value={this.state.newPassword}
                            autoComplete="off"
                            type="password" />
                </FormField>
                <FormField>
                    <TextValidator
                            id="confirm"
                            name="confirm"
                            label="Confirm Password"
                            onChange={ (e) => this.handleInputChange(e.target.name, e.target.value)}
                            margin="dense"
                            validators={['required', 'confirmPassword']}
                            errorMessages={['confirm new password', 'passwords must match']}
                            withRequiredValidator={true}
                            value={this.state.confirm}
                            autoComplete="off"
                            type="password" />
                </FormField>
            </InlineForm>
        );

    }
}

export default ChangePasswordForm;