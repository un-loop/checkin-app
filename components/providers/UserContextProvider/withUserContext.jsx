import * as React from 'react';
import useUserContext from './useUserContext';
import hoistNonReactStatics from 'hoist-non-react-statics';

export default (Component) => {
  const WithUserContext = React.forwardRef((props, ref) => {
    const user = useUserContext();
    return <Component ref={ref} user={user} {...props} />;
  });

  WithUserContext.displayName = Component.displayName;

  hoistNonReactStatics(WithUserContext, Component);

  return WithUserContext;
};
