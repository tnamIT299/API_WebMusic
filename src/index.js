import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Register from "./page/Register";
import Login from "./page/Login";
import axios from 'axios';
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContextProvider } from "./Context";
import Detail from "./components/Detail";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.interceptors.request.use(function (config) {
  config.headers['X-Binarybox-Api-Key'] = process.env.REACT_APP_API_KEY;
  return config;
});

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null && localStorage.getItem("token") !== "";
};
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/App" element={<PrivateRoute element={<App />} />} />
          <Route path="/detail" element={<PrivateRoute element={<Detail />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  // document.getElementById("root")
);

reportWebVitals();