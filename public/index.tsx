import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App";
import { initializeContract } from "../src/util/near";
const root = ReactDOM.createRoot(
  document.getElementById("mountNode") as HTMLElement
);
//@ts-ignore
window.nearInitPromise = initializeContract()
  .then(() => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((err) => console.log(err));
