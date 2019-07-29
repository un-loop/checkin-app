import * as React from "react";
import * as ReactDOM from "react-dom";
import Error500 from "../components/errors/500";
import { parse } from "querystring";

ReactDOM.render(
    <Error500 />,
    document.getElementById("error")
);
