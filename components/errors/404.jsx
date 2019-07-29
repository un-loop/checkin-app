import * as React from "react";
import Section from "../layout/Section";
import Page from "../layout/Page"
import { ProviderWrapper } from '../providers/';

class Error404 extends React.Component {
    render() {
        return (
            <Page title="Page Not Found">
                <Section title="Oops!">
                    That page was not found.
                </Section>
            </Page>
        );
    }
}

// Keep MuiThemeProvider outside of a control that changes state
// so that the theme doesn't re-render
export default (props) =>
        <ProviderWrapper>
            <Error404 {...props} />
        </ProviderWrapper>
