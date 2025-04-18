// App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router";
import "./App.css";

import NavBar          from "./components/NavBar";
import HomePage        from "./pages/HomePage";
import AboutPage       from "./pages/AboutPage";
import WhoWeArePage    from "./pages/WhoWeArePage";
import RegisterPage    from "./Register/RegisterPage";
import RegisterJobSeeker from "./Register/RegisterJobSeeker";
import RegisterCompany   from "./Register/RegisterCompany";
import LoginPage       from "./Login/LoginPage";
import SeekerProfile   from "./SeekerPage/SeekerProfile";
import SwipePage       from "./SeekerPage/SwipePage";
import CompanyPage     from "./CompanyPage/CompanyPage";

function App() {
  const location = useLocation();

  // List of routes where we DO want the NavBar
  const publicRoutes = [
    "/",
    "/about",
    "/who-we-are",
    "/Register",
    "/Register/RegisterJobSeeker",
    "/Register/RegisterCompany",
    "/Login",
  ];

  const showNav = publicRoutes.includes(location.pathname);

  return (
    <>
      {showNav && <NavBar />}

      <Routes>
        <Route path="/"                             element={<HomePage />} />
        <Route path="/about"                        element={<AboutPage />} />
        <Route path="/who-we-are"                   element={<WhoWeArePage />} />
        <Route path="/Register"                     element={<RegisterPage />} />
        <Route path="/Register/RegisterJobSeeker"   element={<RegisterJobSeeker />} />
        <Route path="/Register/RegisterCompany"     element={<RegisterCompany />} />
        <Route path="/Login"                        element={<LoginPage />} />

        {/* Seeker & Company pages */}
        <Route path="/seeker/profile"               element={<SeekerProfile />} />
        <Route path="/seeker/swipe"                 element={<SwipePage />} />
        <Route path="/CompanyPage"                  element={<CompanyPage />} />
      </Routes>
    </>
  );
}

export default App;
