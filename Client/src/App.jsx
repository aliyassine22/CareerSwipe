import React from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import RegisterJobSeeker from "./Register/RegisterJobSeeker";
import RegisterCompany from "./Register/RegisterCompany";
import RegisterPage from "./Register/RegisterPage";
import LoginPage from "./Login/LoginPage";
import SeekerProfile from "./SeekerPage/SeekerProfile";
import SwipePage from "./SeekerPage/SwipePage";
import CompanyPage from "./CompanyPage/CompanyPage";


function App() {
  return (
    <Routes>
      <Route path="/"/>
      <Route path="/Register" element={<RegisterPage />} />
      <Route path="/Register/RegisterJobSeeker" element={<RegisterJobSeeker />} />
      <Route path="/Register/RegisterCompany" element={<RegisterCompany />} />
      <Route path="/seeker/profile" element={<SeekerProfile />} />
      <Route path="/seeker/swipe" element={<SwipePage />} />
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/CompanyPage" element={<CompanyPage />} />
    </Routes>
    );
  }
export default App;