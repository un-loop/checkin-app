import * as React from 'react';
import Section from '../layout/Section';
import Page from '../layout/Page';
import {ProviderWrapper} from '../providers/';

class Error403 extends React.Component {
  render() {
    return (
      <Page title='Forbidden'>
        <Section title='Access Denied'>
          You do not have access to the requested resource.
        </Section>
      </Page>
    );
  }
}

// Keep MuiThemeProvider outside of a control that changes state
// so that the theme doesn't re-render
const wrapped = (props) =>
  <ProviderWrapper>
    <Error403 {...props} />
  </ProviderWrapper>;

wrapped.displayName = 'Error403';

export default wrapped;
