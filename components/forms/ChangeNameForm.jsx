import * as React from "react";
import PropTypes from "prop-types"
import FormField from "./FormField";
import InlineForm from "../layout/InlineForm";
import {withUserContext} from "../providers/UserContextProvider";
import InlineField from "../widgets/InlineField";

function ChangeNameForm(props) {
    const [values, setValues] = React.useState({
        name: props.name
    });

    const handleInputChange = prop => event => {
        setValues({...values, [prop]: event.target.value})
    }

    const save = (e) => {
        e.preventDefault();
        props.onSave && props.onSave(values);
    }

    const cancel = (e) => {
        e.preventDefault();
        setValues({...values, name: props.name});
        props.onCancel && props.onCancel();
    }

    const {saving, onSave,onCancel, inputRef, classes, ...remaining} = props;

    remaining.autoComplete = "off";
    remaining.onSubmit = save;
    remaining.onReset = cancel;

    return (
        <InlineForm {...remaining}>
            <FormField>
                <InlineField
                    id="name"
                    name="name"
                    onChange={handleInputChange("name")}
                    margin="none"
                    validators={['required']}
                    errorMessages={['enter a name']}
                    withRequiredValidator={true}
                    value={values.name}
                    autoComplete="off"
                    inputRef={inputRef}
                    cancel={cancel}
                    save={save}
                />
            </FormField>
        </InlineForm>
    );
}

ChangeNameForm.propTypes = {
    name: PropTypes.string.isRequired
}

export default withUserContext(ChangeNameForm);
