// App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Components
import NavBar from "./components/NavBar";

// Layouts
import SeekerLayout from "./components/Layout/SeekerLayout";
import CompanyLayout from "./components/Layout/CompanyLayout";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import WhoWeArePage from "./pages/WhoWeArePage";
import RegisterPage from "./Register/RegisterPage";
import RegisterJobSeeker from "./Register/RegisterJobSeeker";
import RegisterCompany from "./Register/RegisterCompany";
import LoginPage from "./Login/LoginPage";
import SeekerProfile from "./SeekerPage/SeekerProfile";
import SwipePage from "./SeekerPage/SwipePage";
import HistoryPage from "./SeekerPage/HistoryPage";
import JobDetails from "./Components/JobDetails";
import AdminLogin from "./AdminPage/AdminLogin";
import AdminDashboard from "./AdminPage/AdminDashboard";

// Company Pages
import CompanyPage from "./CompanyPage/CompanyPage";
import CompanyDetails from "./CompanyPage/CompanyDetails";
import CreateJobPosting from "./CompanyPage/CreateJobPosting";
import ManageJobPostings from "./CompanyPage/ManageJobPostings";

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
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/who-we-are" element={<WhoWeArePage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Register/RegisterJobSeeker" element={<RegisterJobSeeker />} />
        <Route path="/Register/RegisterCompany" element={<RegisterCompany />} />
        <Route path="/Login" element={<LoginPage />} />

        {/* Job Seeker Routes with Layout */}
        <Route path="/seeker" element={<SeekerLayout />}>
          <Route path="profile" element={<SeekerProfile />} />
          <Route path="swipe" element={<SwipePage />} />
          <Route path="saved-jobs" element={<div>Saved Jobs</div>} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
        <Route path="/job/:id" element={<JobDetails />} />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Company Routes with Layout */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="jobs" element={<CompanyJobs />} />
          <Route path="job/:id" element={<JobDetails />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
        <Route path="/CompanyPage" element={<CompanyPage />} />
      </Routes>
    </>
  );
}

export default App;
