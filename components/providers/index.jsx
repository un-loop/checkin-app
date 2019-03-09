import { MuiThemeProvider } from "@material-ui/core/styles";
import Theme from "../themes/unloop";
import UserContextProvider from "./UserContextProvider";

export { default as UserContextProvider } from "./UserContextProvider";
export * from "./UserContextProvider";

export const ProviderWrapper = (props) => {
    const { children } = props;

    return (
        <MuiThemeProvider theme={Theme}>
            <UserContextProvider user={{name: "MA"}}>
                {children}
            </UserContextProvider>
        </MuiThemeProvider>
    );
}
