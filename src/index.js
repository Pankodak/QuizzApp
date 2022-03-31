// import React from "react";
// import { render } from "react-dom";
// import App from "./App";
// import { BrowserRouter } from "react-router-dom";

// // Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
// let root = document.createElement("div");

// root.id = "root";
// document.body.appendChild(root);

// // Now we can render our application into it
// render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementById("root")
// );

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
let root = document.createElement("div");

root.id = "root";
document.body.appendChild(root);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
