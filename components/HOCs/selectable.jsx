import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics"
import { v4 } from "uuid"

export default (Component) =>
{
    const className = `uuid${v4()}`;
    let SelectableComponent = React.forwardRef((props, ref) => {
        let newProps = {...props};
        newProps.className = newProps.className ? `${newProps.className} ${className}` :
            className;
        return <Component ref={ref} {...newProps} />;
    });

    hoistNonReactStatics(SelectableComponent, Component);

    SelectableComponent.toString = () => `.${className}`;
    return SelectableComponent;
}
