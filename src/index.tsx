import React from "react";
import ReactDOM from "react-dom";
import "98.css";
import "./components/applications/Clippy/components/css/98.extended.css";
import "./components/applications/Clippy/components/css/Theme.css";
import "./components/applications/Clippy/components/css/App.css";
import "./components/applications/Clippy/clippy-animations.css";
import "./index.css";
import App from "./App";
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
