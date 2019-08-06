import * as React from 'react';
import {MuiThemeProvider} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Theme from '../themes/unloop';
import UserContextProvider from './UserContextProvider';

export {default as UserContextProvider} from './UserContextProvider';
export * from './UserContextProvider';

export const ProviderWrapper = (props) => {
  const initialContext = {
    setUser: () => {
      const results =
        document.cookie.match('(^|[^;]+)\\s*user-context\\s*=\\s*([^;]+)');
      const newContext =
        Object.assign({}, initialContext, JSON.parse(results.pop()));
      setUser(newContext);
    },
  };
  const [user, setUser] = React.useState(initialContext);
  const {children} = props;

  if (user.isLoggedIn === undefined) user.setUser();

  return (
    <MuiThemeProvider theme={Theme}>
      <UserContextProvider user={user}>
        {children}
      </UserContextProvider>
    </MuiThemeProvider>
  );
};

ProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
