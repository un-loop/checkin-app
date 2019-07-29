import * as React from "react";
import Section from "../layout/Section";
import Page from "../layout/Page"
import { ProviderWrapper } from '../providers/';

class Error500 extends React.Component {
    render() {
        return (
            <Page title="Server Error">
                <Section title="Oops!">
                    The server experienced an error processing your request.
                </Section>
            </Page>
        );
    }
}

// Keep MuiThemeProvider outside of a control that changes state
// so that the theme doesn't re-render
export default (props) =>
        <ProviderWrapper>
            <Error500 {...props} />
        </ProviderWrapper>
