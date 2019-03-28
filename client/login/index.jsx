import * as React from "react";
import * as ReactDOM from "react-dom";
//import "typeface-roboto";  //need to fix webpack to load css and font files first
import Login from "../../components/apps/Login"

ReactDOM.render(
    <Login />,
    document.getElementById("login")
);
