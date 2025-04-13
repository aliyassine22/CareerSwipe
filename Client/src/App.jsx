import React from "react";
import { Route, Routes } from "react-router";
import "./App.css";

import RegisterJobSeeker from "./Register/RegisterJobSeeker";
import RegisterCompany from "./Register/RegisterCompany";
import RegisterPage from "./Register/RegisterPage";
import LoginPage from "./Login/LoginPage";


function App() {
  return (
    <Routes>
      <Route path="/"/>
      <Route path="/Register" element={<RegisterPage />} />
      <Route path="/Register/RegisterJobSeeker" element={<RegisterJobSeeker />} />
      <Route path="/Register/RegisterCompany" element={<RegisterCompany />} />
      <Route path="/Login" element={<LoginPage />} />
    </Routes>
    );
  }
export default App;
  