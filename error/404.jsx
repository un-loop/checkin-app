import * as React from "react";
import * as ReactDOM from "react-dom";
import Error404 from "../components/errors/404";
import { parse } from "querystring";

ReactDOM.render(
    <Error404 />,
    document.getElementById("error")
);
