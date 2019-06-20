import * as React from "react";
import DialogForm from "../layout/DialogForm";
import FormField from "../forms/FormField";
import TextValidator from "react-material-ui-form-validator/lib/TextValidator";

class LoginForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            isValid: false
        };
        this.validityMap = {
            username: false,
            password: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.renderField = this.renderField.bind(this);
        this.validateFields = this.validateFields.bind(this);
    }

    handleInputChange(name, value) {
        this.setState({[name]: value});
    }

    validateFields(key, value) {
        this.validityMap[key] = value;
        this.setState({
            isValid: this.validityMap.username && this.validityMap.password
        });
    }

    renderField(props) {
        const { fieldName, ...remainingProps } = props;
        return (
            <TextValidator
                id={fieldName}
                key={fieldName}
                validatorListener={result => {
                    this.validateFields(fieldName, result);
                }}
                onChange={e =>
                    this.handleInputChange(fieldName, e.target.value)
                }
                name={fieldName}
                margin="dense"
                withRequiredValidator={true}
                autoComplete="off"
                value={this.state[fieldName]}
                {...remainingProps}
            />
        );
    }

    render() {
        const {saving, redirect, ...props} = this.props;

        const actions = [
            {
                label: "Sign In",
                formAction: "submit",
                color: "primary",
                loading: saving
            }
        ];
        const LoginField = this.renderField;
        props.autoComplete = "off";
        props.actions = actions;

        return (
            <DialogForm
                {...props}
                disabledSubmit={!this.state.isValid}
                method="POST"
            >
                <FormField>
                    <input type="hidden" name="redirect" value={redirect} />
                    <LoginField
                        fieldName="username"
                        placeholder="you@example.com"
                        label="e-mail"
                        validators={["required", "isEmail"]}
                        errorMessages={[
                            "enter your username",
                            "not a valid email address"
                        ]}
                        autoFocus
                    />
                </FormField>
                <FormField>
                    <LoginField
                        fieldName="password"
                        label="Password"
                        validators={["required"]}
                        errorMessages={["enter your password"]}
                        value={this.state.password}
                        type="password"
                    />
                </FormField>
            </DialogForm>
        );

    }
}

export default LoginForm;
